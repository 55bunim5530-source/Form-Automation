/* Compatibility bridge for the chatbot iframe. The chatbot API obtains official
   law evidence on the server, so this browser bridge does not query law.go.kr. */
(() => {
  'use strict';
  async function lookup(question) {
    if (typeof question !== 'string' || !question.trim() || question.length > 500) {
      return { status: 'unavailable', laws: [], reason: '질문을 확인할 수 없습니다.' };
    }
    return { status: 'unavailable', laws: [], reason: '챗봇 서버가 법제처 API 원문을 직접 조회합니다.' };
  }
  window.safetyChatLawContext = Object.freeze({ lookup });
})();
