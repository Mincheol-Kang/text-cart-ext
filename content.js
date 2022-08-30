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
<input type="checkbox" id="ct_g_i_check_all">
<button id="ct_g_button_delete_them">체크박스 선택 항목 지우기</button>
<div id="ct_g_div_selected_text_list"><ul></ul></div>
<span class="ct_g_span_copied_text">복사된 텍스트: </span>
<textarea id="ct_g_textArea"></textarea>
<button id="ct_g_button_add_text">⇪ 위 입력란의 텍스트를 리스트에 추가하기 ⇪</button>`
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

let ct_g_button_add_text = document.getElementById('ct_g_button_add_text');
let ct_g_textArea = document.getElementById('ct_g_textArea');
ct_g_textArea.onclick = function (e) {
    ct_g_textArea.select();
}
ct_g_button_add_text.onclick = function (e) {
    ct_g_selected_text_list.push(ct_g_textArea.value);
    chrome.storage.local.set({ ct_g_selected_text_list });
    ct_f_make_list();
}

let ct_g_i_check_all = document.getElementById('ct_g_i_check_all');
ct_g_i_check_all.onclick = function (e) {
    const checkboxes = document.getElementsByName('ct_g_checkbox_delete_it');
    for( let i = 0; i < checkboxes.length; i++ ) {
        checkboxes[i].checked = ct_g_i_check_all.checked;
    }
}

let ct_g_button_delete_them = document.getElementById('ct_g_button_delete_them');
ct_g_button_delete_them.onclick = function (e) {
    const checkboxes = document.getElementsByName('ct_g_checkbox_delete_it');
    let temp_list = [];
    for( let i = 0; i < checkboxes.length; i++ ) {
        if(checkboxes[i].checked != true) {
            temp_list.push(ct_g_selected_text_list[i]);
        }
    }
    ct_g_selected_text_list = [...temp_list];
    chrome.storage.local.set({ ct_g_selected_text_list });
    ct_f_make_list();
    ct_g_i_check_all.checked = false;
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
    ct_g_selected_text_list.forEach((element, index) => {
        inner_html += `<li class="ct_g_li_text_list"><input type="checkbox" name="ct_g_checkbox_delete_it"> ${element}</li>`
    });
    inner_html += '</ul>';
    ct_g_div_selected_text_list.innerHTML = inner_html;
}

chrome.storage.local.get(['ct_g_sidebar_show'], function(result) {
    ct_f_toggle_sidebar(result.ct_g_sidebar_show);
});

try {
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
} catch(e) {
    console.error(e);
}
