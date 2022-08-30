let ct_g_selected_text_list = [];
let ct_g_current_text = '';

document.addEventListener('mousemove', (e) => {
    ct_g_current_text = e.target.innerText;
});

document.addEventListener('keydown', (e) => {
    if(e.shiftKey) {
        ct_g_selected_text_list.push(ct_g_current_text);
        chrome.storage.local.set({ ct_g_selected_text_list });
        ct_f_make_list();
    }
});

const ct_g_new_div = document.createElement("div");
ct_g_new_div.innerHTML = `<div style="padding: 5px;"><b>
웹페이지에서 텍스트를 커서로 가리킨채 Shift 키를 누르면 텍스트 바구니에 담깁니다.</b></div>
<div id="ct_g_div_selected_text_list">
텍스트 바구니가 비어 있습니다.</div>
복사된 텍스트: <textarea id="ct_g_textArea"></textarea>`
ct_g_new_div.className = 'ct_g_new_div';
ct_g_new_div.style.display = 'none';
document.body.appendChild(ct_g_new_div);

const ct_g_toggle_div = document.createElement("div");
ct_g_toggle_div.innerHTML = `<div style="padding: 5px;"><input type="checkbox" id="ct_g_i_checkbox_toggle" checked></div>`
ct_g_toggle_div.className = 'ct_g_toggle_div';
ct_g_toggle_div.style.display = 'none';
document.body.appendChild(ct_g_toggle_div);

ct_g_toggle_div.addEventListener('click', function (e) {
    let checkbox_toggle = document.getElementById('ct_g_i_checkbox_toggle');
    const is_checked = checkbox_toggle.checked;
    if(is_checked) {
        ct_g_new_div.style.display = "none";
    } else {
        ct_g_new_div.style.display = "block";
    }
    checkbox_toggle.checked = !is_checked;
});

function ct_f_copyToClipBoard(clicked_text) {
    let content = document.getElementById('ct_g_textArea');
    content.innerText = clicked_text;
    content.select();
    document.execCommand('copy');
}

let ct_g_div_selected_text_list = document.getElementById('ct_g_div_selected_text_list');
ct_g_div_selected_text_list.onclick = function (e) {
    ct_f_copyToClipBoard(e.target.innerText);
}

function ct_f_toggle_sidebar(is_sidebar_show) {
    if(is_sidebar_show) {
        ct_g_new_div.style.display = 'block';
        ct_g_toggle_div.style.display = 'block';
    } else {
        ct_g_new_div.style.display = 'none';
        ct_g_toggle_div.style.display = 'none';
    }
}

function ct_f_make_list() {
    let inner_html = '<ul id="ct_g_ul_text_list">';
    ct_g_selected_text_list.forEach(element => {
        inner_html += `<li class="ct_g_li_text_list">${element}</li>`
    });
    inner_html += '</ul>';
    ct_g_div_selected_text_list.innerHTML = inner_html;
}

chrome.storage.local.get(['ct_g_sidebar_show'], function(result) {
    ct_f_toggle_sidebar(result.ct_g_sidebar_show);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.sidebar_show) {
            const is_sidebar_show = (request.sidebar_show == 'yes');
            chrome.storage.local.set({ ct_g_sidebar_show: is_sidebar_show });
            ct_f_toggle_sidebar(is_sidebar_show);
        }
        if(request.text_list) {
            ct_g_selected_text_list = request.text_list;
            ct_f_make_list();
        }
        sendResponse({farewell: "ok"});
    }
);
