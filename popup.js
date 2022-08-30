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
    
    function set_text_cart(text_list) {
        let inner_html = '<ul>';
        if(text_list.length > 0) {
            text_list.forEach(element => {
                inner_html += `<li><input type="checkbox" name="checkbox_delete_it" class="checkbox-delete">${element}</li>`
            });
        }
        inner_html += '</ul>';
        div_selected_text_list.innerHTML = inner_html;
    }

    chrome.storage.local.get('ct_g_selected_text_list', ({ ct_g_selected_text_list }) => {
        selected_text_list = ct_g_selected_text_list;
        set_text_cart(selected_text_list);
    });

    let check_all = document.getElementById('check_all');
    check_all.onclick = function (e) {
        const checkboxes = document.getElementsByName('checkbox_delete_it');
        for( let i = 0; i < checkboxes.length; i++ ) {
            checkboxes[i].checked = check_all.checked;
        }
    }
    
    let button_delete_them = document.getElementById('button_delete_them');
    button_delete_them.onclick = function (e) {
        if(check_all.checked) {
            selected_text_list = [];
        } else {
            const checkboxes = document.getElementsByName('checkbox_delete_it');
            let temp_list = [];
            for( let i = 0; i < checkboxes.length; i++ ) {
                if(checkboxes[i].checked != true) {
                    temp_list.push(selected_text_list[i]);
                }
            }
            selected_text_list = [...temp_list];
        }
        set_text_cart(selected_text_list);
        check_all.checked = false;
    }

    const sendMessageButton = document.getElementById('sendMessage')
    sendMessageButton.onclick = async function(e) {
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        try {
            chrome.tabs.sendMessage(tabs[0].id, {text_list: selected_text_list}, function(response) {
                console.log(response.farewell);
            });
        } catch(e) {
            console.error(e);
        }
    }

    const div_list_toggle = document.getElementById('div_list_toggle')
    const i_list_toggle   = document.getElementById('i_list_toggle')
    div_list_toggle.onclick = async function(e) {
        const is_toggle_checked = !i_list_toggle.checked;
        const sidebar_show = (is_toggle_checked ? 'yes' : 'no');
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        try {
            chrome.tabs.sendMessage(tabs[0].id, {sidebar_show}, function(response) {
                console.log(response.farewell);
            });
        } catch(e) {
            console.error(e);
        }
        i_list_toggle.checked = is_toggle_checked;
    }
    chrome.storage.local.get(['ct_g_sidebar_show'], function(result) {
        i_list_toggle.checked = result.ct_g_sidebar_show;
    });    
}
