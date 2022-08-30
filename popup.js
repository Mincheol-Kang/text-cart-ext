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
    
    chrome.storage.local.get('ct_g_selected_text_list', ({ ct_g_selected_text_list }) => {
        selected_text_list = ct_g_selected_text_list;
        if(selected_text_list.length > 0) {
            let inner_html = '<ul>';
            selected_text_list.forEach(element => {
                inner_html += `<li>${element}</li>`
            });
            inner_html += '</ul>';
            div_selected_text_list.innerHTML = inner_html;
        }
    });

    const sendMessageButton = document.getElementById('sendMessage')
    sendMessageButton.onclick = async function(e) {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        chrome.tabs.sendMessage(tabs[0].id, {text_list: selected_text_list});
    }

    const div_list_toggle = document.getElementById('div_list_toggle')
    const i_list_toggle   = document.getElementById('i_list_toggle')
    div_list_toggle.onclick = async function(e) {
        const is_toggle_checked = !i_list_toggle.checked;
        const sidebar_show = (is_toggle_checked ? 'yes' : 'no');
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        chrome.tabs.sendMessage(tabs[0].id, {sidebar_show});
        i_list_toggle.checked = is_toggle_checked;
    }
    chrome.storage.local.get(['ct_g_sidebar_show'], function(result) {
        i_list_toggle.checked = result.ct_g_sidebar_show;
    });    
}
