const services = [
  ['통합 메인', 'http://127.0.0.1:8080/__health'],
  ['대표서식', 'http://127.0.0.1:5173/'],
  ['MSDS', 'http://127.0.0.1:3000/'],
  ['챗봇', 'http://127.0.0.1:3001/chatbot'],
];

let failed = false;
for (const [name, url] of services) {
  try {
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
    const ok = response.ok;
    console.log(`${ok ? '정상' : '오류'}\t${name}\tHTTP ${response.status}\t${url}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`오류\t${name}\t${error.message}\t${url}`);
  }
}
process.exitCode = failed ? 1 : 0;
