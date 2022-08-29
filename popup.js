window.onload = function(){
    function copyToClipBoard(clicked_text) {
        let content = document.getElementById('textArea');
        content.innerText = clicked_text;
        content.select();
        document.execCommand('copy');
    }

    let clicked_text = '';
    document.addEventListener('click', function (e) {
        clicked_text = e.target.innerText;
        copyToClipBoard(clicked_text);
    });
    
    let div_selected_text_list = document.getElementById('div_selected_text_list');

    chrome.storage.sync.get('ct_g_selected_text_list', ({ ct_g_selected_text_list }) => {
        let inner_html = '<ul>';
        ct_g_selected_text_list.forEach(element => {
            inner_html += `<li>${element}</li>`
        });
        inner_html += '</ul>';
        div_selected_text_list.innerHTML = inner_html;
    });
}
