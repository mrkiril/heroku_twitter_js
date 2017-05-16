document.onreadystatechange = function () {
if (document.readyState == "complete") {
    var is_auth = false;
    var is_reg = false;
    var upd_twit_id = null;
    var upd_twit_text = null;
    var list_event_obj = [];

    function ajax_get(link, params, foo)
    {   
        var params_str = ''
        var params_arr = []
        if (params != '')
        {
            for (var key in params) 
            {
              params_arr.push(key+"="+data[key]);
            }
            params_str = "?"+params_arr.join("&")
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = foo
        //xhr.open("GET", '/reg/', true);        
        xhr.open("GET", link+params_str, true);        
        xhr.send();
        return false;
    }

    function ajax_post(link, data, foo)
    {
        var csrftoken = getCookie('csrftoken');
        var data_arr = [];
        var data_str = '';
        for (var key in data) 
        {
          data_arr.push(key+"="+data[key]);
        }
        if(data_arr.length > 1)
        {
            data_str = data_arr.join("&");
        }
        else
        {
            data_str = data_arr[0];
        } 
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = foo;
        xhr.open("POST", link, true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data_str);
    }

    function add_listener(item)
    {
        var elem = document.getElementById(item.id);            
        if(elem != null)
        {
            elem.removeEventListener(item.event, item.foo);
            elem.addEventListener(item.event, item.foo);
        }
        else
        {
            var el_list = document.querySelectorAll(item.id);                
            for (var i = 0, len = el_list.length; i < len; i++)
            {
                el = el_list[i]
                el.addEventListener(item.event, item.foo);
            }
        }
    }

    document.addEventListener("DOMNodeInserted", function (event) 
    {
        var textNode = event.target;        
        for (var j = 0, len2 = list_event_obj.length; j < len2; j++)
        {  
            add_listener(list_event_obj[j])
        };
    }, false);
   
    function on(html_event, html_id, html_foo)
    {
        var obj = { 
            id: html_id, 
            event : html_event, 
            foo: html_foo
        }

        list_event_obj.push( obj );
        add_listener( obj )
        /*
        var el = document.getElementById(html_id);
        if(el != null)
        {
            el.addEventListener(html_event, html_foo);
        }
        else
        {
            var el_list = document.querySelectorAll(html_id);                
            for (var i = 0, len = el_list.length; i < len; i++)
            {
                el = el_list[i];
                el.addEventListener(html_event, html_foo);
            }
        }
        */
    }

    on("click", "registration_link", function(event) 
    {
        event.preventDefault();        
        ajax_get('/reg/', '', function () {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                location.reload()
                
            }
            else
            {
                document.querySelector('body').innerHTML = this.responseText;
            }
        })
        return false;
    }); 

    on("change", "auth_form", function(event) 
    {
        if (is_auth == true)
        {
            auth_form_clear()
            is_auth = false;
        }
        return false;
    });

    on("submit", "auth_form", function(event) 
    {
        event.preventDefault();
        var data = {};
        data["enter_username"] = encodeURIComponent(document.getElementById("enter_username").value);
        data["password"]= encodeURIComponent(document.getElementById("password").value);
        link = document.getElementById("auth_form").getAttribute("action")
        ajax_post(link, data, function(){
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                location.reload()
            }
            else
            {   
                try
                {
                    data = this.responseText;
                    var reg_json = JSON.parse(data);
                    if (data == "UNCORECT_USER")
                    { 
                        auth_form_fail();                    
                        is_auth = true;
                    }
                    else
                    {  
                        document.querySelector(reg_json.where).innerHTML = reg_json.what;
                    }
                }
                catch(e)
                {
                    alert("Something went wrong. this page will reload")
                    location.reload()
                }
            }
        })
        return false;
    });

    on("submit", "reg_form", function(event) 
    {
        event.preventDefault();
        //event.stopPropagation();
        clearregform()        
        var data = {};
        link = document.getElementById("reg_form").getAttribute("action")
        data["username"] = encodeURIComponent(document.getElementById("reg_username").value);
        data["password1"] = encodeURIComponent(document.getElementById("password_1").value);
        data["password2"] = encodeURIComponent(document.getElementById("password_2").value);
        ajax_post(link, data, function()
        {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
            }
            else
            {
                try
                {
                    data = this.responseText;
                    var reg_json = JSON.parse(data);
                    if ("username" in reg_json)
                    {   
                        allmes_reg(reg_json);
                    }
                    else if ("where" in reg_json && "what" in reg_json)
                    { 
                        document.querySelector(reg_json.where).innerHTML = reg_json.what;
                    }
                }
                catch(e)
                {
                    alert("Something went wrong. Reload this page");
                    location.reload();
                }
            }
        })
        return false;
    });

    on("submit", "logout", function(event) 
    {
        event.preventDefault();
        link = document.getElementById("logout").getAttribute("action");
        data = {"type_post" : encodeURIComponent(document.querySelector("#type_post").value) }
        ajax_post(link, data, function()
        {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
            }
            else
            {
                try
                {
                    data = this.responseText                
                    var reg_json = JSON.parse(data)
                    document.querySelector(reg_json.where).innerHTML = reg_json.what;
                }
                catch(e)
                {
                    alert("Something went wrong. Reload this page")
                    location.reload()
                }
            }
        })        
        return false;
    });

    on("change", "reg_username", function(event) 
    {
        event.preventDefault();
        clearregform_user()

        link = "/regform/";
        data = {}
        data["username"] = encodeURIComponent(document.getElementById("reg_username").value);
        data["password1"] = encodeURIComponent(document.getElementById("password_1").value);
        data["password2"] = encodeURIComponent(document.getElementById("password_2").value);

        ajax_post(link, data, function()
        {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                try
                {
                    data = this.responseText                
                    var mes_json = JSON.parse(data);
                    if(mes_json.username.status == 'ok')
                    {
                        reg_user_sucses(mes_json)
                    }

                    else if(mes_json.username.status == 'false')
                    {
                        reg_user_fail(mes_json)
                    }
                }
                catch(e)
                {
                    alert("Something went wrong. Reload this page")
                    location.reload()
                }
            }
        })        
        return false;
    });

    on("change", "password_div_1", function(event) 
    {
        event.preventDefault();
        clearregform_pas1()

        link = "/regform/";
        data = {}
        data["username"] = encodeURIComponent(document.getElementById("reg_username").value);
        data["password1"] = encodeURIComponent(document.getElementById("password_1").value);
        data["password2"] = encodeURIComponent(document.getElementById("password_2").value);
        ajax_post(link, data, function()
        {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                try
                {
                    data = this.responseText
                    var mes_json = JSON.parse(data);
                    if(mes_json.password1.status == 'false' && document.getElementById("password_2").value != '')
                    {
                        reg_pass1_fail(mes_json)
                    }
                    else
                    {
                        clearregform_pas1()
                        clearregform_pas2()
                    }
                }
                catch(e)
                {
                    alert("Something went wrong. Reload this page")
                    location.reload()
                }
            }
        })
        return false;
    });
    
    on("change", "password_div_2", function(event) 
    {
        event.preventDefault();
        clearregform_pas1()
        clearregform_pas2()

        link = "/regform/";
        data = {}
        data["username"] = encodeURIComponent(document.getElementById("reg_username").value);
        data["password1"] = encodeURIComponent(document.getElementById("password_1").value);
        data["password2"] = encodeURIComponent(document.getElementById("password_2").value);
        ajax_post(link, data, function()
        {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                try
                {
                    data = this.responseText
                    var mes_json = JSON.parse(data);
               
                    if(mes_json.password1.status == 'ok' && mes_json.password2.status == 'ok')
                    {
                        reg_pass1_sucses()
                        reg_pass2_sucses()
                    }
                    
                    else if(mes_json.password1.status == 'false')
                    {
                        reg_pass1_fail(mes_json)
                        reg_pass2_fail(mes_json)
                    }
                }
                catch(e)
                {
                    alert("Something went wrong. Reload this page")
                    location.reload()
                }
            }
        })
        return false;
    });

    on("submit", "send_post", function(event) 
    {
        event.preventDefault();        
        var csrftoken = getCookie('csrftoken');
        data = {"new_twit_text" : encodeURIComponent(document.getElementById("new_twit_text").value)}
        link = document.querySelector("#send_post").getAttribute("action")
        ajax_post(link, data, function()
        {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                return;
            }
            else
            {
                try
                {
                    data = this.responseText
                    var twit_json = JSON.parse(data)
                    add_twittolist(twit_json.id, twit_json.twit, twit_json.date)                
                    document.getElementById("new_twit_text").value = ""
                }
                catch(e)
                {
                    alert("Укулеле. Если вы е играли на етом инструменте вы многое потеряли. Тем не менее Something went wrong. Reload this page!")
                    location.reload()
                }
            }
        })
        return false;
    });

    on('click', 'a[href^=\\/twit\\/del]', function(event) 
    {
        event.stopImmediatePropagation();
        event.preventDefault();
             
        link = this.getAttribute("href")
        data = {'del_id' : this.getAttribute('id').match( /del_(\d+)/i )[1] }
        ajax_post(link, data, function()
        {
            if (this.readyState != 4) return;
            else if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
            }
            else
            {   
                try
                {
                    var twit_json = JSON.parse(this.responseText);
                    if ("del_twit" in twit_json )
                    {  
                        document.querySelector(twit_json.del_twit).remove()
                    }
                }
                catch(e)
                {
                    alert("Укулеле. Если вы е играли на етом инструменте вы многое потеряли. Тем не менее Something went wrong. Reload this page!")
                    location.reload() 
                }
            }

        })
        return false;
    });

    on('click', 'a[href^=\\/twit\\/upd]', function(event) 
    {
        event.preventDefault();
        var id = this.getAttribute('id').match( /upd_(\d+)/i )[1];
        var last_twit;
        var csrftoken = getCookie('csrftoken');
        var data_str = "";

        if(upd_twit_id == null && upd_twit_text == null)
        {
            link = "twit/get/"+id;
            ajax_get(link, "", function()
            {
                if (this.readyState != 4) return;
                if (this.status != 200) 
                { 
                    alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                    return;
                }
                else
                {
                    try
                    {
                        var twit_json = JSON.parse(this.responseText);
                        if ("twit" in twit_json )
                        { 
                            last_twit = twit_json.twit
                            edit_dict = upd_twitform(id, last_twit);
                            upd_twit_id = edit_dict['id'];
                            upd_twit_text = edit_dict['edit_twit'];

                            document.querySelector("#upd_"+upd_twit_id).style.display = "none"
                            document.querySelector("#del_"+upd_twit_id).style.display = "none"
                            document.querySelector("#twi_text_"+upd_twit_id).style.display = "none"
                        }
                    }
                    catch(e)
                    {
                        alert("Укулеле. Если вы е играли на етом инструменте вы многое потеряли. Тем не менее Something went wrong. Reload this page!")
                        location.reload() 
                    }
                }
            })
        }
        else
        {
            edit_animate('#upd_twi_'+upd_twit_id, "#ff817f")
            var delayMillis = 1500; 
            setTimeout(function() 
            {
                edit_animate('#upd_twi_'+upd_twit_id, "#ffffff")
            }, delayMillis);
            
        }    
        
        return false;
    });

    on('click', 'button[id=confirm_twit_edit]', function(event) {
        event.preventDefault();
        //event.stopPropagation();
        if( upd_twit_text == document.getElementById( 'upd_twi_'+upd_twit_id ).value )
        {
            twit_form_back(upd_twit_id, document.getElementById( 'twi_text_'+upd_twit_id ).innerHTML )
        }
        else
        {   
            new_twi = document.getElementById( 'upd_twi_'+upd_twit_id ).value
            data = {}
            data["upd_id"] = upd_twit_id;
            data["text_twit"] = encodeURIComponent(new_twi);
            link = 'twit/upd/'
            ajax_post(link, data, function()
            {
                if (this.readyState != 4) return;
                if (this.status != 200) 
                {   
                    try
                    {
                        twit_form_back(upd_twit_id, new_twi)     
                    }
                    catch(e)
                    {
                        alert("Укулеле. Если вы е играли на етом инструменте вы многое потеряли. Тем не менее Something went wrong. Reload this page!")
                        location.reload()
                    }
                }
                else
                {   
                    try
                    {
                        var mes_json = JSON.parse(this.responseText);
                        twit_form_back(upd_twit_id, mes_json.twit);
                    }   
                    catch(e)
                    {
                        alert("Укулеле. Если вы е играли на етом инструменте вы многое потеряли. Тем не менее Something went wrong. Reload this page!")
                        location.reload()
                    }
                }
            })
        }
        return false;
    });

    on('click', 'button[id=cansel_twit_edit]', function(event) {
        event.preventDefault();
        try
        {
            twit_form_back(upd_twit_id, document.getElementById( 'twi_text_'+upd_twit_id ).innerHTML )
        }
        catch(e)
        {
            alert("Something went wrong. Reload this page!")
            location.reload()
        }
        return false;
    });

    function reg_pass1_fail(mes_json)
    {
        document.querySelector("#password_div_1").classList.add('has-error', 'has-feedback');
        var span_span = document.createElement('span');
        span_span.id = "glyphicon_pass_1"
        span_span.classList.add("glyphicon")
        span_span.classList.add("glyphicon-remove")
        span_span.classList.add("form-control-feedback")
        document.querySelector("#hor_pass_div_1").appendChild(span_span);

        
        var label_label = document.createElement('label');
        label_label.classList.add("help-block")
        label_label.innerHTML = mes_json.username.message
        document.querySelector("#hor_pas1_mg").appendChild(label_label); 
    }

    function reg_user_sucses(mes_json)
    {
        document.querySelector("#reg_username_div").classList.add('has-success', 'has-feedback');
        var span_span = document.createElement('span');
        span_span.id = "glyphicon_username"
        span_span.classList.add("glyphicon")
        span_span.classList.add("glyphicon-ok")
        span_span.classList.add("form-control-feedback")
        document.querySelector("#hor_user_div").appendChild(span_span);
    }

    function reg_user_fail(mes_json)
    {
        document.querySelector("#reg_username_div").classList.add('has-error', 'has-feedback');        
        var span_span = document.createElement('span');
        span_span.id = "glyphicon_username"
        span_span.classList.add("glyphicon")
        span_span.classList.add("glyphicon-remove")
        span_span.classList.add("form-control-feedback")
        document.querySelector("#hor_user_div").appendChild(span_span);


        var label_label = document.createElement('label');
        label_label.classList.add("help-block")
        label_label.innerHTML = mes_json.username.message
        document.querySelector("#hor_user_mg").appendChild(label_label);
    }

    function reg_pass1_sucses()
    {
        document.querySelector("#password_div_1").classList.add('has-success', 'has-feedback');
        var span_span1 = document.createElement('span');
        span_span1.id = "glyphicon_pass_1"
        span_span1.classList.add("glyphicon")
        span_span1.classList.add("glyphicon-ok")
        span_span1.classList.add("form-control-feedback")
        document.querySelector("#hor_pass_div_1").appendChild(span_span1);
    }

    function reg_pass2_sucses()
    {
        document.querySelector("#password_div_2").classList.add('has-success', 'has-feedback');
        var span_span2 = document.createElement('span');
        span_span2.id = "glyphicon_pass_2"
        span_span2.classList.add("glyphicon")
        span_span2.classList.add("glyphicon-ok")
        span_span2.classList.add("form-control-feedback")
        document.querySelector("#hor_pass_div_2").appendChild(span_span2);
    }

    function reg_pass1_fail(mes_json)
    {
        document.querySelector("#password_div_1").classList.add('has-error', 'has-feedback');
        var span_span1 = document.createElement('span');
        span_span1.id = "glyphicon_pass_1"
        span_span1.classList.add("glyphicon")
        span_span1.classList.add("glyphicon-remove")
        span_span1.classList.add("form-control-feedback")
        document.querySelector("#hor_pass_div_1").appendChild(span_span1);


        var label_label1 = document.createElement('label');
        label_label1.classList.add("help-block")
        label_label1.innerHTML = mes_json.password1.message
        document.querySelector("#hor_pas1_mg").appendChild(label_label1);
    }

    function reg_pass2_fail(mes_json)
    {
        document.querySelector("#password_div_2").classList.add('has-error', 'has-feedback');                    
        var span_span2 = document.createElement('span');
        span_span2.id = "glyphicon_pass_2"
        span_span2.classList.add("glyphicon")
        span_span2.classList.add("glyphicon-remove")
        span_span2.classList.add("form-control-feedback")
        document.querySelector("#hor_pass_div_2").appendChild(span_span2);
        

        var label_label2 = document.createElement('label');
        label_label2.classList.add("help-block")
        label_label2.innerHTML = mes_json.password2.message
        document.querySelector("#hor_pas2_mg").appendChild(label_label2);
    }

    function auth_form_clear()
    {
        document.querySelector("#enter_username_div").classList.remove('has-error', 'has-success', 'has-feedback')
        document.querySelector("#password_div").classList.remove('has-error', 'has-success', 'has-feedback')
        if (document.querySelector("#glyphicon_user_remove") != null)
        {
            document.querySelector("#glyphicon_user_remove").remove();
        }

        if (document.querySelector("#glyphicon_pass_remove") != null)
        {
            document.querySelector("#glyphicon_pass_remove").remove();
        }
    }

    function auth_form_fail()
    {
        document.querySelector("#enter_username_div").classList.add('has-error', 'has-feedback');
        document.querySelector("#password_div").classList.add('has-error', 'has-feedback');
        

        var span_span2 = document.createElement('span');
        span_span2.id = "glyphicon_user_remove"
        span_span2.classList.add("glyphicon", "glyphicon-remove", "form-control-feedback")
        document.querySelector("#hor_user_div").appendChild(span_span2);

        var span_span2 = document.createElement('span');
        span_span2.id = "glyphicon_pass_remove"
        span_span2.classList.add("glyphicon", "glyphicon-remove", "form-control-feedback")
        document.querySelector("#hor_pass_div").appendChild(span_span2);
    }

    function clearregform()
    { 
        clearregform_user()
        clearregform_pas1()
        clearregform_pas2()
    }

    function clearregform_user()
    {
        document.querySelector("#reg_username_div").classList.remove('has-error', 'has-success', 'has-feedback')
        if (document.querySelector("#glyphicon_username") != null)
        {
            document.querySelector("#glyphicon_username").remove();
        }
        document.querySelector("#hor_user_mg").innerHTML = "";
    }

    function clearregform_pas1()
    {
        document.querySelector("#password_div_1").classList.remove('has-error', 'has-success', 'has-feedback');
        document.querySelector("#hor_pas1_mg").innerHTML = "";
        if (document.querySelector("#glyphicon_pass_1") != null)
        {
            document.querySelector("#glyphicon_pass_1").remove();
        }
    }

    function clearregform_pas2()
    {
        document.querySelector("#password_div_2").classList.remove('has-error', 'has-success', 'has-feedback');
        document.querySelector("#hor_pas2_mg").innerHTML = "";
        if (document.querySelector("#glyphicon_pass_2") != null)
        {
            document.querySelector("#glyphicon_pass_2").remove();
        }
    }

    function allmes_reg(mes_json)
    {
        if(mes_json.username.status == 'ok')
        {
            reg_user_sucses(mes_json)
        }

        if(mes_json.username.status == 'false')
        {
            reg_user_fail(mes_json)
        }

        if(mes_json.password1.status == 'ok' && mes_json.password2.status == 'ok')
        { 
            reg_pass1_sucses()
            reg_pass2_sucses()
        }

        if(mes_json.password1.status == 'false' || mes_json.password2.status == 'false')
        {
            reg_pass1_fail(mes_json)
            reg_pass2_fail(mes_json)            
        }
    }

    function add_twittolist(id, twit, date)
    {
        var div_div = document.createElement('div');
        div_div.id = 'twit_'+id
        div_div.classList.add("blog-post")
        new_twit =  document.querySelector('#template_twit').innerHTML
        new_twit = new_twit.replace( /ID/g, id )
        new_twit = new_twit.replace( /DATE_TEMP/g, date )
        new_twit = new_twit.replace( /TWIT/g, twit )
        div_div.innerHTML = new_twit
        document.querySelector("#list_twit").appendChild(div_div);
    }

    function upd_twitform(id, last_twit)
    {
        var input_el = document.createElement('input');
        input_el.id = 'upd_twi_'+id
        input_el.type = 'text'
        input_el.value = last_twit
        input_el.classList.add("form-control", "form_post")
        document.querySelector("#twit_"+id).appendChild(input_el);


        var input_el = document.createElement('button');
        input_el.id = 'confirm_twit_edit'
        input_el.type = 'button'        
        input_el.classList.add("btn", "btn-default", "btn-sm", "form_margin_inl")
        input_el.innerHTML = "Confirm changes"
        document.querySelector("#twit_"+id).appendChild(input_el);


        var input_el2 = document.createElement('button');
        input_el2.id = 'cansel_twit_edit'
        input_el2.type = 'button'        
        input_el2.classList.add("btn", "btn-default", "btn-sm", "form_margin_inl")
        input_el2.innerHTML = "Cancel"
        document.querySelector("#twit_"+id).appendChild(input_el2);
        return {"id": id, "edit_twit": last_twit}
    }

    function twit_form_back(id, text_twit)
    {
        document.querySelector("#upd_"+id).style.display = "inline-block";
        document.querySelector("#del_"+id).style.display = "inline-block";
        document.querySelector("#twi_text_"+id).style.display = "block";
        document.querySelector("#twi_text_"+id).innerHTML = text_twit
        
        document.querySelector("#upd_twi_"+id).remove();
        document.querySelector("#confirm_twit_edit").remove();
        document.querySelector("#cansel_twit_edit").remove(); 

        upd_twit_id = null;
        upd_twit_text = null;
    }

    function edit_animate(parent_id, color)
    {
        document.querySelector(parent_id).style.backgroundColor = color
    }

    function getCookie(name) 
    {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) 
    {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) 
    {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    
}
}