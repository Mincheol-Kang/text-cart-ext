window.onload = function(){
    function copyToClipBoard(clicked_text) {
        let content = document.getElementById('textArea');
        content.innerText = clicked_text;
        content.select();
        document.execCommand('copy');
    }

    let div_selected_text_list = document.getElementById('div_selected_text_list');
    div_selected_text_list.onclick = function(e) {
        copyToClipBoard(e.target.innerText);
    }

    let selected_text_list = [];
    
    chrome.storage.sync.get('ct_g_selected_text_list', ({ ct_g_selected_text_list }) => {
        selected_text_list = ct_g_selected_text_list;
        let inner_html = '<ul>';
        selected_text_list.forEach(element => {
            inner_html += `<li>${element}</li>`
        });
        inner_html += '</ul>';
        div_selected_text_list.innerHTML = inner_html;
    });

    const sendMessageButton = document.getElementById('sendMessage')
    sendMessageButton.onclick = async function(e) {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
    
        chrome.tabs.sendMessage(tabs[0].id, {text_list: selected_text_list});
    }
}
