// 헤더 통합검색 Logic
const searchEl = document.querySelector('.search');
const searchInputEl = searchEl.querySelector('input');

searchEl.addEventListener('click', function() {
    searchInputEl.focus();
});

searchInputEl.addEventListener('focus', function() {
    searchEl.classList.add('focused');
    searchInputEl.setAttribute('placeholder', '통합검색');
})

searchInputEl.addEventListener('blur', function() { // focusOut , blur 이벤트 버블링 여부 차이
    searchEl.classList.remove('focused');
    searchInputEl.setAttribute('placeholder', '');
    searchInputEl.value = '' // 텍스트 필드 값 비우기
})
  
  /* footer Copyright */
const thisYear = document.querySelector('.this-year');
thisYear.textContent = new Date().getFullYear();
