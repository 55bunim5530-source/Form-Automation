import sys
import fitz  # PyMuPDF
import json
import os
import re

def extract_full_msds_from_doc(doc, full_text):
    # Split text into 16 sections
    sec_pattern = re.compile(r'^\s*(\d{1,2})\.\s*([^\n\r]+)', re.MULTILINE)
    matches = list(sec_pattern.finditer(full_text))
    sections = {}
    for i, m in enumerate(matches):
        sec_num = int(m.group(1))
        sec_title = m.group(2).strip()
        start = m.end()
        end = matches[i+1].start() if i + 1 < len(matches) else len(full_text)
        content = full_text[start:end].strip()
        if 1 <= sec_num <= 16 and sec_num not in sections:
            sections[sec_num] = {'title': sec_title, 'content': content}

    sec1 = sections.get(1, {}).get('content', '')
    sec2 = sections.get(2, {}).get('content', '')
    sec3 = sections.get(3, {}).get('content', '')
    sec4 = sections.get(4, {}).get('content', '')
    sec5 = sections.get(5, {}).get('content', '')
    sec6 = sections.get(6, {}).get('content', '')
    sec7 = sections.get(7, {}).get('content', '')
    sec8 = sections.get(8, {}).get('content', '')
    sec13 = sections.get(13, {}).get('content', '')
    sec14 = sections.get(14, {}).get('content', '')

    # 1. Product Name
    prod_name = None
    for pattern in [
        r'(?:가\.\s*)?제품명\s*[:\-\]]?\s*([^\n\r]+)',
        r'○\s*제품명\s*[:\-\]]?\s*([^\n\r]+)',
        r'제품명\s*\n\s*[:\-]?\s*([^\n\r]+)'
    ]:
        m = re.search(pattern, sec1 or full_text)
        if m:
            val = re.sub(r'^[-\s:○]+', '', m.group(1)).strip()
            if val and len(val) > 1 and not val.startswith('나.'):
                prod_name = val
                break

    # 2. Manufacturer
    maker = None
    for pattern in [
        r'(?:회사명|제조자|제조사|공급자|수입자)\s*[:\-\]]\s*([^\n\r]+)',
        r'○\s*(?:회사명|제조자|제조사|공급자)\s*[:\-\]]\s*([^\n\r]+)'
    ]:
        m = re.search(pattern, sec1 or full_text)
        if m:
            val = re.sub(r'^[-\s:○]+', '', m.group(1)).strip()
            if val and len(val) > 1:
                maker = val
                break

    # 3. Revision Date
    rev_date = None
    for pattern in [
        r'(?:최종\s*개정\s*일자|최종\s*개정일|개정\s*일자|개정일|Revision\s*date|Date\s*of\s*issue|작성\s*일자)[^\n\r]*?(\d{4}[-./]\d{1,2}[-./]\d{1,2})',
        r'(\d{4}[-./]\d{1,2}[-./]\d{1,2})'
    ]:
        m = re.search(pattern, full_text, re.IGNORECASE)
        if m:
            rev_date = m.group(1).replace('.', '-').replace('/', '-')
            break

    # 4. Section 2: Signal word
    signal_word = '경고'
    m = re.search(r'신호어\s*[:\-\]]\s*([^\n\r]+)', sec2)
    if m:
        sig = re.sub(r'^[-\s:○]+', '', m.group(1)).strip()
        if '위험' in sig: signal_word = '위험'
        elif '경고' in sig: signal_word = '경고'
        else: signal_word = sig
    elif '위험' in sec2:
        signal_word = '위험'

    # Hazard statements (Hxxx or Korean hazard statements)
    h_matches = re.findall(r'(H\d{3}[A-Za-z]?\s*[:\-]?\s*[^\n\r]+)', sec2 or full_text)
    h_list = []
    seen_h = set()
    for h in h_matches:
        hc = re.sub(r'\s+', ' ', h.strip())
        code = hc[:4]
        if code not in seen_h:
            seen_h.add(code)
            h_list.append(hc)
    if not h_list and sec2:
        for line in sec2.split('\n'):
            line = line.strip('- ○* \t')
            if any(k in line for k in ['유해', '위험', '자극', '독성', '폭발', '화재']) and len(line) > 4:
                h_list.append(line)
        h_list = h_list[:6]

    # Precautionary statements
    def extract_prec(p_code_prefix, kor_keyword, txt):
        lines = []
        p_matches = re.findall(rf'({p_code_prefix}\d{{2}}[A-Za-z0-9+]*\s*[:\-]?\s*[^\n\r]+)', txt)
        if p_matches:
            for p in p_matches:
                p_clean = re.sub(r'\s+', ' ', p.strip())
                if p_clean not in lines:
                    lines.append(p_clean)
        else:
            m = re.search(rf'(?:{kor_keyword})\s*[:\-\)]\s*([^\n\r]+(?:\n[ \t]*[-○*][^\n\r]+)*)', txt)
            if m:
                sub_lines = [l.strip('- ○* \t') for l in m.group(1).split('\n') if l.strip()]
                lines.extend(sub_lines)
        return '\n'.join(lines) if lines else '해당없음'

    prev_text = extract_prec('P2', '예방', sec2)
    resp_text = extract_prec('P3', '대응', sec2)
    stor_text = extract_prec('P4', '저장', sec2)
    disp_text = extract_prec('P5', '폐기', sec2)

    # 4. GHS Pictograms - Strict UN GHS / KOSHA rules
    picts = []
    
    # 4-A. Direct text inspection under '그림문자'
    m_pic = re.search(r'(?:○|\b)?\s*그림문자\s*[:\-\]]?\s*([^\n\r○신호어]+)', sec2)
    explicit_none = False
    if m_pic:
        sub_txt = m_pic.group(1).strip()
        if any(w in sub_txt for w in ['해당없음', '없음', '자료없음', '분류되지 않음']):
            explicit_none = True
        else:
            for name in ['폭발물', '인화성', '산화성', '고압가스', '부식성', '급성독성', '경고/자극성', '자극성', '경고', '건강유해성', '수생환경유해성', '환경유해성']:
                if name in sub_txt:
                    picts.append('건강유해성' if '건강' in name else ('수생환경유해성' if '환경' in name else name))

    if not picts:
        # Evaluate exact UN GHS / KOSHA H-code rules
        for h in h_list:
            h_clean = h.upper().strip()
            # 1. 폭발물
            if re.search(r'\b(H200|H201|H202|H203|H204|H205|H240|H241)\b', h_clean):
                picts.append('폭발물')
            # 2. 인화성 (H220~H226, H228 등)
            if re.search(r'\b(H220|H221|H222|H223|H224|H225|H226|H228|H242|H250|H251|H252|H260|H261)\b', h_clean):
                picts.append('인화성')
            # 3. 산화성
            if re.search(r'\b(H270|H271|H272)\b', h_clean):
                picts.append('산화성')
            # 4. 고압가스
            if re.search(r'\b(H280|H281)\b', h_clean):
                picts.append('고압가스')
            # 5. 부식성 (피부부식 1, 심한 눈손상 1)
            if re.search(r'\b(H290|H314|H318)\b', h_clean):
                picts.append('부식성')
            # 6. 급성독성 (구분 1, 2, 3 - 해골)
            if re.search(r'\b(H300|H301|H310|H311|H330|H331)\b', h_clean):
                picts.append('급성독성')
            # 7. 경고/자극성 (구분 4, 피부자극, 눈자극, 호흡기자극 등)
            elif re.search(r'\b(H302|H312|H332|H315|H317|H319|H335|H336)\b', h_clean):
                picts.append('경고/자극성')
            # 8. 건강유해성 (발암성, 변이원성, 생식독성, 표적장기독성, 흡인유해성, 호흡기과민성)
            if re.search(r'\b(H334|H340|H341|H350|H351|H360|H361|H362|H370|H371|H372|H373|H304|H305)\b', h_clean):
                picts.append('건강유해성')
            # 9. 수생환경유해성 (급성 1, 만성 1, 만성 2 ONLY. H412, H413은 그림문자 없음!)
            if re.search(r'\b(H400|H410|H411)\b', h_clean):
                picts.append('수생환경유해성')

    picts = list(dict.fromkeys(picts))

    # 5. Section 3: Ingredients
    ingredients = []
    seen_cas = set()

    for page in doc:
        tabs = page.find_tables()
        for t in tabs:
            rows = t.extract()
            if not rows or len(rows) < 2: continue
            hdr = ' '.join([str(c or '') for c in rows[0]])
            if 'NFPA' in hdr: continue
            if any(k in hdr for k in ['화학물질명', '물질명', '성분명', 'CAS', '함유량', '관용명']):
                cas_col = -1
                name_col = -1
                pct_col = -1
                for ci, cell in enumerate(rows[0]):
                    c_str = str(cell or '')
                    if 'CAS' in c_str: cas_col = ci
                    elif '함유' in c_str or '%' in c_str: pct_col = ci
                    elif any(k in c_str for k in ['화학물질명', '물질명', '성분명']): name_col = ci
                if name_col == -1: name_col = 0 if len(rows[0]) > 0 else -1

                for r in rows[1:]:
                    if not r or all(c is None for c in r): continue
                    name = str(r[name_col] if name_col >= 0 and name_col < len(r) and r[name_col] else '').strip()
                    if not name or any(k in name for k in ['화학물질명', '기재되지', '응급조치', '※', '합계', 'GHS', '총량', '한계농도']):
                        continue
                    cas = None
                    if cas_col >= 0 and cas_col < len(r) and r[cas_col]:
                        cm = re.search(r'\b\d{2,7}-\d{2}-\d\b', str(r[cas_col]))
                        if cm: cas = cm.group(0)
                    if not cas:
                        for cell in r:
                            if cell:
                                cm = re.search(r'\b\d{2,7}-\d{2}-\d\b', str(cell))
                                if cm:
                                    cas = cm.group(0)
                                    break
                    content = '미표기'
                    if pct_col >= 0 and pct_col < len(r) and r[pct_col]:
                        content = str(r[pct_col]).strip()
                    else:
                        for cell in r:
                            if cell and any(c.isdigit() for c in str(cell)) and ('%' in str(cell) or '~' in str(cell) or '∼' in str(cell) or '-' in str(cell)):
                                content = str(cell).strip()
                                break
                    if not content.endswith('%') and any(c.isdigit() for c in content):
                        content += '%'

                    name_clean = name.split('\n')[0].split(';')[0].strip(' ;,-/|()')
                    key_id = f"{name_clean}_{cas or content}"
                    if key_id not in seen_cas:
                        seen_cas.add(key_id)
                        ingredients.append({
                            'name': name_clean,
                            'cas_no': cas,
                            'content': content
                        })

    if not ingredients and sec3:
        for line in sec3.split('\n'):
            line = line.strip()
            cas_m = re.search(r'\b(\d{2,7}-\d{2}-\d)\b', line)
            pct_m = re.search(r'(\d+(?:\.\d+)?\s*[~∼\-]\s*\d+(?:\.\d+)?%?|\d+(?:\.\d+)?%|<|>|≤|≥)', line)
            if cas_m or '영업비밀' in line:
                cas = cas_m.group(1) if cas_m else None
                pct = pct_m.group(1) if pct_m else '미표기'
                if not pct.endswith('%') and any(c.isdigit() for c in pct):
                    pct += '%'
                name_clean = line
                if cas: name_clean = name_clean.replace(cas, '')
                if pct_m: name_clean = name_clean.replace(pct_m.group(0), '')
                name_clean = re.sub(r'KE-\d+|/\s*', '', name_clean).strip(' ;,-/|()')
                name_clean = name_clean.split(';')[0].strip()
                if name_clean and len(name_clean) > 1 and not any(k in name_clean for k in ['화학물질명', 'CAS', '함유량']):
                    key_id = f"{name_clean}_{cas or pct}"
                    if key_id not in seen_cas:
                        seen_cas.add(key_id)
                        ingredients.append({
                            'name': name_clean,
                            'cas_no': cas,
                            'content': pct
                        })

    def summarize(txt, max_len=250):
        if not txt: return '정보 없음'
        cleaned = re.sub(r'\[PAGE_\d+\]\s*', '', txt)
        lines = [l.strip() for l in cleaned.split('\n') if l.strip() and not l.strip().isdigit() and '/' not in l[:5]]
        res = ' '.join(lines[:5])
        return (res[:max_len] + '...') if len(res) > max_len else res

    un_no = None
    m = re.search(r'\b(UN\s*\d{4})\b', sec14, re.IGNORECASE)
    if m:
        un_no = m.group(1).replace(' ', '').upper()

    return {
        'product_name': prod_name or '제품명 확인 필요',
        'manufacturer': maker or '제조사 확인 필요',
        'revision_date': rev_date or '개정일자 미표기',
        'hazards_section2': {
            'signal_word': signal_word,
            'pictograms': picts,
            'hazard_statements': h_list,
            'precautionary_statements': {
                'prevention': prev_text,
                'response': resp_text,
                'storage': stor_text,
                'disposal': disp_text
            }
        },
        'ingredients_section3': ingredients,
        'first_aid_section4': summarize(sec4),
        'fire_section5': summarize(sec5),
        'spill_section6': summarize(sec6),
        'handling_storage_section7': summarize(sec7),
        'ppe_section8': summarize(sec8),
        'disposal_section13': summarize(sec13),
        'transport_section14': {
            'un_no': un_no
        }
    }

def extract_pdf_content(pdf_path):
    md_content = []
    images = []
    ghs_images = []
    
    try:
        pdf_dir = os.path.dirname(pdf_path)
        base_name = os.path.splitext(os.path.basename(pdf_path))[0]
        
        doc = fitz.open(pdf_path)
        full_text_parts = []
        for i, page in enumerate(doc):
            md_content.append(f"## Page {i+1}\n")
            text = page.get_text("text")
            if text:
                md_content.append(text.strip())
                md_content.append("\n")
                full_text_parts.append(f"\n[PAGE_{i+1}]\n" + text)
                
            # Detect coordinates of Section 2 "그림문자"
            blocks = page.get_text("blocks")
            pic_y = None
            sig_y = None
            for b in blocks:
                btxt = b[4].strip()
                if ('그림문자' in btxt or '그림 문자' in btxt) and pic_y is None:
                    pic_y = b[1]
                if ('신호어' in btxt or '유해·위험' in btxt or '유해위험' in btxt) and pic_y is not None and sig_y is None:
                    if b[1] > pic_y:
                        sig_y = b[3]

            image_list = page.get_images(full=True)
            for img_index, img in enumerate(image_list):
                try:
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    image_filename = f"{base_name}_page{i+1}_img{img_index}.{image_ext}"
                    image_filepath = os.path.join(pdf_dir, image_filename)
                    
                    with open(image_filepath, "wb") as f:
                        f.write(image_bytes)
                        
                    image_url = f"/uploads/{image_filename}"
                    images.append(image_url)
                    md_content.append(f"\n[Image Extracted: {image_url}]\n")

                    # Check if image is located in the GHS pictogram zone under '그림문자'
                    rects = page.get_image_rects(xref)
                    is_ghs_img = False
                    for r in rects:
                        mid_y = (r.y0 + r.y1) / 2
                        if pic_y is not None:
                            limit_y = sig_y if sig_y else (pic_y + 140)
                            if (pic_y - 10) <= mid_y <= (limit_y + 15):
                                w = r.x1 - r.x0
                                h = r.y1 - r.y0
                                if h > 0 and 0.4 <= (w / h) <= 2.5:
                                    is_ghs_img = True
                                    break
                    if is_ghs_img and image_url not in ghs_images:
                        ghs_images.append(image_url)
                except Exception:
                    pass
                    
        full_text = "".join(full_text_parts)
        parsed_data = extract_full_msds_from_doc(doc, full_text)
        if parsed_data and 'hazards_section2' in parsed_data:
            parsed_data['hazards_section2']['ghs_images'] = ghs_images
            
        return "\n".join(md_content), images, ghs_images, parsed_data
    except Exception as e:
        return f"Error extracting content: {str(e)}", [], [], None

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python extract_table.py <pdf_path>"}, ensure_ascii=False))
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(json.dumps({"error": f"File not found: {pdf_path}"}, ensure_ascii=False))
        sys.exit(1)
        
    result_md, extracted_images, ghs_images, parsed_data = extract_pdf_content(pdf_path)
    
    print(json.dumps({
        "success": True, 
        "markdown": result_md,
        "images": extracted_images,
        "ghs_images": ghs_images,
        "parsed_data": parsed_data
    }, ensure_ascii=False))
