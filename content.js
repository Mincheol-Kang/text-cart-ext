let ct_g_selected_text_list = [];
let ct_g_current_text = '';

document.addEventListener('mousemove', function (e) {
    ct_g_current_text = e.target.innerText;
});

document.addEventListener('keydown', function (e) {
    if(e.shiftKey) {
        ct_g_selected_text_list.push(ct_g_current_text);
        chrome.storage.sync.set({ ct_g_selected_text_list });
        ct_f_make_list();
    }
});

const ct_g_new_div = document.createElement("div");
ct_g_new_div.innerHTML = `<div style="padding: 5px;"><b>
웹페이지에서 텍스트를 커서로 가리킨채 Shift 키를 누르면 텍스트 바구니에 담깁니다.</b></div>
<div id="ct_g_div_selected_text_list" style="width: 100%; border: 1px dotted green; margin-top: 5px; margin-bottom: 5px;">
텍스트 바구니가 비어 있습니다.</div>
복사된 텍스트: <textarea id="ct_g_textArea" style="width: 100%; height: 50px;"></textarea>`
ct_g_new_div.style.border = "thick solid #0000FF";
ct_g_new_div.style.padding = "10px";
ct_g_new_div.style.color = "black";
ct_g_new_div.style.background = "white";
ct_g_new_div.style.position = "fixed";
ct_g_new_div.style.overflow = "auto";
ct_g_new_div.style.zIndex = "99990000000000";
ct_g_new_div.style.width = "350px";
ct_g_new_div.style.height = "95vh";
ct_g_new_div.style.top = "0px";
ct_g_new_div.style.right = "0px";
document.body.appendChild(ct_g_new_div);

const ct_g_toggle_div = document.createElement("div");
ct_g_toggle_div.innerHTML = `<div style="padding: 5px;"><input type="checkbox" id="ct_g_i_checkbox_toggle" checked></div>`
ct_g_toggle_div.style.border = "1px solid green";
ct_g_toggle_div.style.background = "white";
ct_g_toggle_div.style.position = "fixed";
ct_g_toggle_div.style.zIndex = "99990000000001";
ct_g_toggle_div.style.width = "50px";
ct_g_toggle_div.style.height = "50px";
ct_g_toggle_div.style.bottom = "0px";
ct_g_toggle_div.style.right = "0px";
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

function ct_f_make_list() {
    let inner_html = '<ul style="margin: 10px; padding-inline-start: 5px;">';
    ct_g_selected_text_list.forEach(element => {
        inner_html += `<li style="padding: 0px 3px; cursor: pointer;">${element}</li>`
    });
    inner_html += '</ul>';
    ct_g_div_selected_text_list.innerHTML = inner_html;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        ct_g_selected_text_list = request.text_list;
        ct_f_make_list();
        sendResponse({status: "done"});
    }
);
