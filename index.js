var fs = require('fs');

fs.readFile('input.csv', 'utf8', function(err,data){
    if(err) {
        console.error("Could not open file: %s", err);
        process.exit(1);
    }
	
    //console.log(data);
    var header = "";
    var body = "";
    var content = data.toString();
    var headers = [];
    var bodies = [];
    var result = [];
    var first_char = 0;
    var last_char = 0;
    var headers_position = 0;
    var bodies_position = 0;

    function getSubstring (stretch){
        var first_char = 0;
        var last_char = 0;
        var new_substring = "";

        for(var index = 0; index < stretch.length; index ++){
            if(stretch.charAt(index) == "/"){
                last_char = index;
                new_substring = new_substring + stretch.substring(first_char, last_char) + " ";
                
                if(stretch.charAt(index + 1) == " "){
                    first_char = index + 2;
                }
                else{
                    first_char = index + 1;
                }
            }

            else if(index == stretch.length - 1){
                last_char = stretch.length;
                new_substring = new_substring + stretch.substring(first_char, last_char);
            }

            else if(stretch.charAt(index) == '"'){
                first_char ++;
                for(index ++; index < stretch.length; index ++){
                    if(stretch.charAt(index) == ","){
                        last_char = index;
                        new_substring = new_substring + stretch.substring(first_char, last_char) + " ";
                        first_char = last_char + 2;
                    }

                    else if(stretch.charAt(index) == '"'){
                        last_char = index;
                        new_substring = new_substring + stretch.substring(first_char, last_char);
                    }
                }
            }
        }

        return new_substring;
    }

    function previousClass (result, index_result){
        var class_position;
        for(var index = index_result - 1; index >= 0; index--){
            if(result[index].charAt(0) == "c"){
                class_position = index;
                break;
            }
        }

        return class_position;
    }

    function isEmail (email){
        var condition1 = false;
        var condition2 = false;
        var result = false;

        if(email.substring(email.length-4, email.length) == ".com"){
            condition1 = true;
        }

        for(var index = 0; index < email.length; index++){
            if(email.charAt(index) == "@"){
                condition2 = true;
                break;
            }
        }

        if(condition1 == true && condition2 == true){
            result = true;
        }

        return result;
    }

    function isPhone (phone){
        var count = 0;
        var result = false;

        for(var index = 0; index < phone.length; index++){
            if(phone.charAt(index) == " "){
                for(index ++; index < phone.length; index++){
                    count++;
                }
            }
        }

        if(count == 8 || count == 9){
            result = true;
        }

        return result;
    }

    //Guarda os cabeçalhos da tabela em uma String
    for(var index = 0; index < data.length; index++){
        if(content.charAt(index) == '\n'){
            break;
        }
        else{
            header = header + content.charAt(index);
        }
    }

    //Guarda o conteúdo da tabela em uma String
    for(index ++; index < data.length; index++){
        body = body + content.charAt(index);
    }

    //Separa os cabeçalhos e os guarda em um vetor
    for(index = 0; index < header.length; index++){
        if(header.charAt(index) == '"'){
            first_char ++;
            for(index ++; index < header.length; index++){
                if(header.charAt(index) == '"'){
                    last_char = index;
                    headers [headers_position] = header.substring(first_char, last_char);
                    headers_position ++;
                    first_char = last_char + 2;
                    index += 2;
                    break;
                }
            }
        }
        else if(header.charAt(index) == "," || index == header.length - 1){
            last_char = index;
            headers [headers_position] = header.substring(first_char, last_char);
            headers_position ++;
            first_char = last_char + 1;
        }
    }

    //Separa o conteúdo e o guarda em um vetor
    first_char = 0;
    for(index = 0; index < body.length; index++){
        if(body.charAt(index) == '"'){
            first_char ++;
            for(index ++; index < body.length; index++){
                if(body.charAt(index) == '"'){
                    last_char = index;
                    bodies [bodies_position] = body.substring(first_char, last_char);
                    bodies_position ++;
                    first_char = last_char + 2;
                    index += 2;
                    break;
                }
            }
        }
        else if(body.charAt(index) == "," || body.charAt(index) == '\r' || index == body.length - 1){
            last_char = index;
            bodies [bodies_position] = body.substring(first_char, last_char);
            bodies_position ++;
            first_char = last_char + 1;
        }
        else if(body.charAt(index) == '\n'){
            first_char ++;
        }
    }

    var index_aux = 0;
    var index_result = 0;
    var index_1 = 0;
    var current_name = "";
    var classes = "";
    var string_aux = "";
    var array_aux = [];
    var previous_class = 0;

    for(index = 0; index <= bodies_position; index++){
        if(headers [index_aux] == "fullname" && bodies [index] != current_name){
            result [index_result] = headers [index_aux] + " : " + bodies [index];
            index_result ++;
            current_name = bodies [index];
        }
        
        else if(headers [index_aux] == "fullname" && bodies [index] == current_name){
            array_aux [0] = result [index_result - 2];
            array_aux [1] = result [index_result - 1];
            console.log(">>>>>", array_aux);
            index_result = index_result - 2;
            index = index + 2;
            classes = classes + getSubstring(bodies [index]);
            index ++;
            classes = classes + " " + getSubstring(bodies [index]);
            previous_class = previousClass(result, index_result);
            result [previous_class] = result [previous_class] + " " + classes;
            classes = "";
            index_aux = index_aux + 3;

            for(index_1 = 0; index_1 < 6; index_1 ++){
                if(headers [index_aux].charAt(0) == "e"){
                    if(isEmail(getSubstring(bodies [index]))){
                        string_aux = getSubstring(headers [index_aux]);
                        result [index_result] = "type : email";
                        index_result ++;
                        result [index_result] = "tags : " + string_aux.substring(6, string_aux.length);
                        index_result ++;
                        result [index_result] = "address : " + getSubstring(bodies [index]);
                        index_result ++;
                        index ++;
                        index_aux ++;
                    }
                }

                else if(headers [index_aux].charAt(0) == "p"){
                    if(isPhone(bodies [index])){
                        string_aux = getSubstring(headers [index_aux]);
                        result [index_result] = "type : phone";
                        index_result ++;
                        result [index_result] = "tags : " + string_aux.substring(6, string_aux.length);
                        index_result ++;
                        result [index_result] = "address : " + bodies [index];
                        index_result ++;
                        index ++;
                        index_aux ++;
                    }
                }
            }

            for(index_1 = 0; index_1 < 2; index_1 ++){
                if(bodies [index] == "0" || bodies [index] == "no" || bodies [index] == ""){
                    result [index_result] = array_aux [index_1]
                    index_result ++;
                    index ++;
                    index_aux ++;
                }
        
                else if(bodies [index] == "1" || bodies [index] == "yes"){
                    result [index_result] = headers [index_aux] + " : true";
                    index_result ++;
                    index ++;
                    index_aux ++;
                }
            }
        }

        else if(headers [index_aux] == "eid"){
            result [index_result] = headers [index_aux] + " : " + bodies [index];
            index_result ++;
        }

        else if(headers [index_aux] == "class"){
            classes = classes + getSubstring(bodies [index]);
            index ++;
            classes = classes + " " + getSubstring(bodies [index]);

            result [index_result] = "classes" + " : " + classes;
            index_result ++;
            result [index_result] = "addresses :";
            index_result ++;
            index_aux ++;
            classes = "";
        }

        else if(headers [index_aux].charAt(0) == "e"){
            if(isEmail(getSubstring(bodies [index]))){
                string_aux = getSubstring(headers [index_aux]);
                result [index_result] = "type : email";
                index_result ++;
                result [index_result] = "tags : " + string_aux.substring(6, string_aux.length);
                index_result ++;
                result [index_result] = "address : " + getSubstring(bodies [index]);
                index_result ++;
            }
        }

        else if(headers [index_aux].charAt(0) == "p"){
            if(isPhone(bodies [index])){
                string_aux = getSubstring(headers [index_aux]);
                result [index_result] = "type : phone";
                index_result ++;
                result [index_result] = "tags : " + string_aux.substring(6, string_aux.length);
                index_result ++;
                result [index_result] = "address : " + bodies [index];
                index_result ++;
            }
        }
        
        else if(headers [index_aux] == "invisible" || headers [index_aux] == "see_all"){
            if(bodies [index] == "0" || bodies [index] == "no" || bodies [index] == ""){
                result [index_result] = headers [index_aux] + " : false";
                index_result ++;
            }

            else if(bodies [index] == "1" || bodies [index] == "yes"){
                result [index_result] = headers [index_aux] + " : true";
                index_result ++;
            }
        }
        
        if(index_aux == headers_position - 1){
            index_aux = 0;
        }
        else{
            index_aux ++;
        }
    }

    var JSON_string = JSON.stringify(result);
    fs.writeFile("./output.json", JSON_string, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

});