window.onload = evaluateAllContent;

let searchBar = document.getElementsByClassName('search');
for (let i = 0; i<searchBar.length; i++) {
    let searchObj = searchBar[i];
    searchObj.addEventListener('input', searchFromSearchBox, false);
}

let checkBoxes = document.getElementsByClassName('match-case');
for (let i = 0; i<checkBoxes.length; i++) {
    let checkBoxObj = checkBoxes[i];
    checkBoxObj.addEventListener('change', applyCaseValidation, false);
}

let data_sources = document.getElementsByClassName('content-data');
for (let i = 0; i<data_sources.length; i++) {
    let data_source= data_sources[i];
    data_source.oninput = (e) => {
        let count_r = evaluateContent(data_source.innerText);
        updateMainDataCount(data_source, count_r[0], count_r[1]);
        searchFromDataChange(data_source);
    }
}

function searchFromSearchBox() {
    searchFromInputObject(this);
}

function searchFromDataChange(data_obj) {
    manageCursor(data_obj);
    let input_box_classes = data_obj.getAttribute('searchbox');
    let input_boxes = document.getElementsByClassName(input_box_classes);
    for (let i = 0; i < input_boxes.length; i++) {
        searchFromInputObject(input_boxes[i]);
    }
}

function applyValidation(target_input_class) {
    let input_boxes = document.getElementsByClassName(target_input_class);
    for (let i = 0; i < input_boxes.length; i++) {
        searchFromInputObject(input_boxes[i]);
    }
}

function searchFromInputObject(current) {
    let target_class    = current.getAttribute('target');
    let result_class    = current.getAttribute('result');
    let count_class     = current.getAttribute('count');
    let validator_class = current.getAttribute('validator');
    let target          = document.getElementsByClassName(target_class);
    let validator       = document.getElementsByClassName(validator_class)[0];
    let key             = current.value;

    for (let i = 0; i<target.length; i++){
        let target_string   = target[i].innerText;
        let res             = [0, target_string];
        if (key.length > 0) {
            if (validator.checked) {
                res = search(key, target_string);
            } else {
                res = searchCI(key, target_string);
            }
        }
        let results = document.getElementsByClassName(result_class);
        for (let j = 0; j<results.length; j++) {
            results[j].innerHTML = `<div>${res[1]}</div>`;
        }

        let counters = document.getElementsByClassName(count_class);
        for (let j = 0; j<counters.length; j++) {
            counters[j].innerHTML = res[0];
        }
    }
}

// case sensitive
function search(key, string) {
    let splited_source  = string.split(key);
    let total_occurance = splited_source.length-1;
    let result_str      = splited_source.join("<span class='selected'>"+key+"</span>");
    return [total_occurance, result_str];
}
// case insensitive
function searchCI(key, string) {
    let splited_source  = string.toLowerCase().split(key.toLowerCase());
    let total_occurance = splited_source.length-1;
    let start           = 0;
    let length          = key.length;
    let new_string      = "";
    for (let i=0; i<total_occurance; i++) {
        start           += splited_source[i].length;
        let temp_key    = string.substr(start+i, length);
        let start_string= i==0?string.slice(0, start):new_string.slice(0, start+i+(i*30));
        new_string      = start_string+"<span class='selected'>"+temp_key+"</span>"+string.slice(start+length+i);
        start           += length-1;
    }
    if (new_string.length <= 0)
        return [total_occurance, string];
    else
        return [total_occurance, new_string];
}

function applyCaseValidation() {
    let current         = this;
    let value           = current.checked;
    let input_box_class = current.getAttribute('target');
    applyValidation(input_box_class);
}

function evaluateContent(content) {
    let length = content.length;
    let spaces = content.split(' ').length - 1;
    return [length, spaces];

}

function evaluateAllContent() {
    for (let i = 0; i<data_sources.length; i++) {
        let data_source = data_sources[i];
        let content     = data_source.innerText;
        let count_r     = evaluateContent(content);
        updateMainDataCount(data_source, count_r[0], count_r[1]);
    }
}

function updateMainDataCount(data_object, total_characters = "N/A", total_spaces = "N/A") {
    if (data_object && data_object.parentNode) {
        let parent = data_object.parentNode;
        if (
            parent.children.length > 1 && 
            parent.children[1].children.length > 1 && 
            parent.children[1].children[0].children.length > 1 
        ) {
            parent.children[1].children[0].children[1].innerText = total_characters;
        }

        if (
            parent.children.length > 1 && 
            parent.children[1].children.length > 1 && 
            parent.children[1].children[1].children.length > 1 
        ) {
            parent.children[1].children[1].children[1].innerText = total_spaces;
        }
    }
}
function manageCursor(data_source) {
    data_source.focus();
    document.execCommand('selectAll', false, null);
    document.getSelection().collapseToEnd();
}
