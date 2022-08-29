window.onload = function(){
    function copyToClipBoard(clicked_text) {
        let content = document.getElementById('textArea');
        content.innerText = clicked_text;
        content.select();
        document.execCommand('copy');
    }

    document.addEventListener('click', function (e) {
        copyToClipBoard(e.target.innerText);
    });
    
    chrome.storage.sync.get('ct_g_selected_text_list', ({ ct_g_selected_text_list }) => {
        let inner_html = '<ul>';
        ct_g_selected_text_list.forEach(element => {
            inner_html += `<li>${element}</li>`
        });
        inner_html += '</ul>';
        let div_selected_text_list = document.getElementById('div_selected_text_list');
        div_selected_text_list.innerHTML = inner_html;
    });
}
