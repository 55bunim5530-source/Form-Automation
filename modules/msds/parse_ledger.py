import sys
import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET
import olefile
import zlib
import struct

def parse_hwpx(file_path):
    tables = []
    paragraphs = []
    
    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            section_names = [n for n in zf.namelist() if n.startswith('Contents/section') and n.endswith('.xml')]
            section_names.sort()
            
            for sname in section_names:
                xml_data = zf.read(sname)
                root = ET.fromstring(xml_data)
                
                for elem in root.iter():
                    tag = elem.tag.split('}')[-1]
                    if tag == 'tbl':
                        tbl = []
                        for tr in elem:
                            if tr.tag.split('}')[-1] == 'tr':
                                row = []
                                for tc in tr:
                                    if tc.tag.split('}')[-1] == 'tc':
                                        txts = [t.text for t in tc.iter() if t.tag.split('}')[-1] == 't' and t.text]
                                        cell_text = ' '.join(txts).strip()
                                        row.append(cell_text)
                                if row and any(c for c in row):
                                    tbl.append(row)
                        if tbl and len(tbl) > 1:
                            tables.append(tbl)
                    elif tag == 't' and elem.text:
                        txt = elem.text.strip()
                        if txt:
                            paragraphs.append(txt)
    except Exception as e:
        sys.stderr.write(f"HWPX parse error: {str(e)}\n")
        
    return tables, paragraphs

def parse_hwp(file_path):
    tables = []
    paragraphs = []
    
    if not olefile.isOleFile(file_path):
        return tables, paragraphs
        
    try:
        ole = olefile.OleFileIO(file_path)
        file_header = ole.openstream('FileHeader').read()
        flags = struct.unpack('<I', file_header[36:40])[0]
        is_compressed = bool(flags & 0x01)
        
        sections = [s for s in ole.listdir() if len(s) == 2 and s[0] == 'BodyText' and s[1].startswith('Section')]
        sections.sort(key=lambda s: int(s[1].replace('Section', '')) if s[1].replace('Section', '').isdigit() else 0)
        
        raw_paras = []
        for sec_path in sections:
            stream_data = ole.openstream(sec_path).read()
            if is_compressed:
                try:
                    stream_data = zlib.decompress(stream_data, -15)
                except Exception:
                    try:
                        stream_data = zlib.decompress(stream_data)
                    except Exception:
                        continue
            
            idx = 0
            total_len = len(stream_data)
            cur_tbl = None
            
            def finalize_table(t):
                if not t:
                    return None
                grid = []
                for r in range(t['rows']):
                    row_vals = []
                    for c in range(t['cols']):
                        txt = ' '.join(t['cells'].get((r, c), [])).strip()
                        row_vals.append(txt)
                    grid.append(row_vals)
                if len(grid) >= 2 and any(any(c for c in r) for r in grid):
                    return grid
                return None

            while idx + 4 <= total_len:
                header = struct.unpack('<I', stream_data[idx:idx+4])[0]
                idx += 4
                tag_id = header & 0x3FF
                size = (header >> 20) & 0xFFF
                if size == 0xFFF:
                    if idx + 4 <= total_len:
                        size = struct.unpack('<I', stream_data[idx:idx+4])[0]
                        idx += 4
                
                payload = stream_data[idx:idx+size]
                idx += size
                
                # HWPTAG_TABLE = 69
                if tag_id == 69:
                    if cur_tbl:
                        g = finalize_table(cur_tbl)
                        if g:
                            tables.append(g)
                        cur_tbl = None
                    if len(payload) >= 8:
                        n_rows = struct.unpack('<H', payload[4:6])[0]
                        n_cols = struct.unpack('<H', payload[6:8])[0]
                        if n_rows > 0 and n_cols > 0:
                            cur_tbl = {
                                'rows': n_rows,
                                'cols': n_cols,
                                'cells': {},
                                'cur_r': 0,
                                'cur_c': 0
                            }
                
                # HWPTAG_LIST_HEADER = 70
                elif tag_id == 70:
                    if cur_tbl and len(payload) >= 4:
                        col = struct.unpack('<H', payload[0:2])[0]
                        row = struct.unpack('<H', payload[2:4])[0]
                        cur_tbl['cur_r'] = row
                        cur_tbl['cur_c'] = col

                # HWPTAG_PARA_TEXT = 67
                elif tag_id == 67:
                    chars = []
                    p_idx = 0
                    while p_idx + 2 <= len(payload):
                        code = struct.unpack('<H', payload[p_idx:p_idx+2])[0]
                        p_idx += 2
                        if code == 0:
                            break
                        elif code in (9, 10, 13):
                            chars.append('\t' if code == 9 else ' ')
                        elif code < 32:
                            if code in (1, 2, 3, 11, 12, 14, 15, 16, 17, 18, 21, 22, 23):
                                p_idx += 12
                            elif code in (4, 5, 6, 7, 8, 9, 19, 20):
                                pass
                        else:
                            chars.append(chr(code))
                    p_text = ''.join(chars).strip()
                    if p_text:
                        raw_paras.append(p_text)
                        if cur_tbl:
                            r, c = cur_tbl['cur_r'], cur_tbl['cur_c']
                            if (r, c) not in cur_tbl['cells']:
                                cur_tbl['cells'][(r, c)] = []
                            cur_tbl['cells'][(r, c)].append(p_text)

            if cur_tbl:
                g = finalize_table(cur_tbl)
                if g:
                    tables.append(g)
                cur_tbl = None

        ole.close()
        paragraphs = raw_paras
        
        # Check if tab-separated rows exist in paragraphs as fallback
        tab_rows = []
        for p in paragraphs:
            parts = [c.strip() for c in p.split('\t')]
            if len(parts) >= 3 and any(parts):
                tab_rows.append(parts)
        if len(tab_rows) >= 2:
            tables.append(tab_rows)
            
    except Exception as e:
        sys.stderr.write(f"HWP parse error: {str(e)}\n")
        
    return tables, paragraphs

def parse_pdf(file_path):
    tables = []
    paragraphs = []
    try:
        import fitz
        doc = fitz.open(file_path)
        for page in doc:
            tabs = page.find_tables()
            for t in tabs:
                extracted = t.extract()
                clean_rows = []
                for r in extracted:
                    if r and any(c for c in r):
                        clean_rows.append([str(c or '').strip() for c in r])
                if len(clean_rows) >= 2:
                    tables.append(clean_rows)
                    
            text = page.get_text("text")
            for line in text.split('\n'):
                line_str = line.strip()
                if line_str:
                    paragraphs.append(line_str)
    except Exception as e:
        sys.stderr.write(f"PDF parse error: {str(e)}\n")
        
    return tables, paragraphs

def parse_excel(file_path):
    tables = []
    try:
        import openpyxl
        wb = openpyxl.load_workbook(file_path, data_only=True)
        for sname in wb.sheetnames:
            sheet = wb[sname]
            clean_rows = []
            for r in sheet.iter_rows(values_only=True):
                row_vals = [str(c or '').strip() for c in r]
                if any(row_vals):
                    clean_rows.append(row_vals)
            if len(clean_rows) >= 2:
                tables.append(clean_rows)
    except Exception as e:
        sys.stderr.write(f"Excel parse error: {str(e)}\n")
    return tables, []

def map_tables_to_rows(tables):
    all_extracted_rows = []
    
    header_keywords = ['제품', '품명', '화학', '명칭', '물질명', '제조', '공급', '업체', '성분', 'cas', '부서', '장소', '위치', '보관', '상태', '일자', 'msds', '연번', '번호', '용도']
    
    for tbl in tables:
        if len(tbl) < 2:
            continue
            
        # Find best header row
        best_header_idx = -1
        best_match_count = 0
        
        for r_idx in range(min(5, len(tbl))):
            row = tbl[r_idx]
            match_count = 0
            for cell in row:
                c_lower = cell.lower().replace(' ', '')
                if any(k in c_lower for k in header_keywords):
                    match_count += 1
            if match_count > best_match_count:
                best_match_count = match_count
                best_header_idx = r_idx
                
        if best_header_idx == -1 or best_match_count < 2:
            continue
            
        header_row = tbl[best_header_idx]
        
        # Column mapping
        col_no = -1
        col_prod = -1
        col_maker = -1
        col_usage = -1
        col_place = -1
        col_dept = -1
        col_status = -1
        
        for c_idx, cell in enumerate(header_row):
            c_clean = cell.lower().replace(' ', '')
            if any(k in c_clean for k in ['제품', '품명', '화학', '명칭', '물질명']) and col_prod == -1:
                col_prod = c_idx
            elif any(k in c_clean for k in ['제조', '공급', '업체', '수입']) and col_maker == -1:
                col_maker = c_idx
            elif any(k in c_clean for k in ['용도', '사용목적', '세부용도']) and col_usage == -1:
                col_usage = c_idx
            elif any(k in c_clean for k in ['장소', '위치', '보관']) and col_place == -1:
                col_place = c_idx
            elif any(k in c_clean for k in ['부서', '사용과', '담당']) and col_dept == -1:
                col_dept = c_idx
            elif any(k in c_clean for k in ['상태', '사용여부', '취급', '비고']) and col_status == -1:
                col_status = c_idx
            elif any(k in c_clean for k in ['연번', '번호', 'no', '순번']) and col_no == -1:
                col_no = c_idx
                
        # If product column still not matched, guess column 1 or 0
        if col_prod == -1:
            col_prod = 1 if len(header_row) > 1 else 0
            
        # Parse data rows
        for r_idx in range(best_header_idx + 1, len(tbl)):
            row = tbl[r_idx]
            if not row or all(not str(c).strip() for c in row):
                continue
                
            def get_val(idx):
                if idx >= 0 and idx < len(row):
                    return str(row[idx] or '').strip().replace('\n', ' ')
                return ''
                
            prod_val = get_val(col_prod)
            
            # Skip if product name is empty or repeat of header
            if not prod_val or any(k in prod_val.replace(' ', '') for k in ['제품명', '화학제품명', '물질명', '연번', '총계', '합계']):
                continue
                
            maker_val = get_val(col_maker)
            usage_val = get_val(col_usage)
            place_val = get_val(col_place) or get_val(col_dept)
            status_raw = get_val(col_status)
            
            if '중단' in status_raw or '폐기' in status_raw:
                status_val = '사용중단'
            elif '확인' in status_raw:
                status_val = '확인 필요'
            else:
                status_val = '사용 중'
                        
            all_extracted_rows.append({
                'product': prod_val,
                'maker': maker_val or '미표기',
                'usage': usage_val or '-',
                'place': place_val or '시설관리실',
                'useStatus': status_val
            })
            
    return all_extracted_rows

def fallback_parse_paragraphs(paragraphs):
    # When no explicit table was detected, inspect text for ledger patterns
    extracted_rows = []
    
    # Pattern: 1. 제품명: xxx, 제조사: yyy ... or lines with CAS numbers
    for p in paragraphs:
        cas_m = re.search(r'\b\d{2,7}-\d{2}-\d\b', p)
        if cas_m and len(p) > 5:
            # Split line by space or comma
            tokens = p.split()
            prod_guess = tokens[0] if tokens else '미상'
            extracted_rows.append({
                'product': prod_guess,
                'maker': '확인 필요',
                'cas': cas_m.group(0),
                'currentMsds': '-',
                'revisionStatus': '확인 필요',
                'revisionDate': '-',
                'revisionSummary': '원문 대조 필요',
                'dept': '행정실/시설관리',
                'place': '보관함',
                'useStatus': '사용 중'
            })
            
    return extracted_rows

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'No file path provided'}, ensure_ascii=False))
        return
        
    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(json.dumps({'success': False, 'error': f'File not found: {file_path}'}, ensure_ascii=False))
        return
        
    ext = os.path.splitext(file_path)[1].lower()
    tables = []
    paragraphs = []
    
    if ext == '.hwpx':
        tables, paragraphs = parse_hwpx(file_path)
    elif ext == '.hwp':
        tables, paragraphs = parse_hwp(file_path)
    elif ext == '.pdf':
        tables, paragraphs = parse_pdf(file_path)
    elif ext in ('.xlsx', '.xls'):
        tables, paragraphs = parse_excel(file_path)
    else:
        print(json.dumps({'success': False, 'error': f'Unsupported file extension: {ext}'}, ensure_ascii=False))
        return
        
    rows = map_tables_to_rows(tables)
    
    # If no rows extracted from tables, try paragraphs fallback
    if not rows and paragraphs:
        rows = fallback_parse_paragraphs(paragraphs)
        
    # Assign row numbers
    for i, r in enumerate(rows):
        r['no'] = i + 1
        
    print(json.dumps({
        'success': True,
        'count': len(rows),
        'rows': rows,
        'fileName': os.path.basename(file_path)
    }, ensure_ascii=False))

if __name__ == '__main__':
    main()
