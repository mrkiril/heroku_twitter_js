document.onreadystatechange = function () {
if (document.readyState == "complete") {
    var is_auth = false;
    var is_reg = false;
    var upd_twit_id = null;
    var upd_twit_text = null;
    var list_event_obj = [];

    
    document.addEventListener("DOMNodeInserted", function (event) 
    {
        var textNode = event.target;        
        list_event_obj.forEach(function(item, k, list_event_obj)        
        {  
            
            var el = document.getElementById(item.id);            
            if(el != null)
            {
                el.removeEventListener(item.event, item.foo);
                el.addEventListener(item.event, item.foo);
            }
            else
            {
                var el_list = document.querySelectorAll(item.id);
                el_list.forEach(function(el, j, el_list)
                {  
                    if(el != null)
                    {
                        el.removeEventListener(item.event, item.foo);
                        el.addEventListener(item.event, item.foo);
                    }
                })
            }
            

        });
    }, false);
   
    function on(html_event, html_id, html_foo)
    {
        var obj = { 
            id: html_id, 
            event : html_event, 
            foo: html_foo
        }

        list_event_obj.push( obj );
        var el = document.getElementById(html_id);

        if(el != null)
        {
            el.addEventListener(html_event, html_foo);
        }
    }

    on("click", "registration_link", function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", '/reg/', true);
        xhr.onreadystatechange = function ()
        {       
            if(xhr.readyState == 4)
            {
                document.querySelector('body').innerHTML = xhr.responseText;
            }
            
        }
        xhr.send();
        return false;
    }); 

    on("change", "auth_form", function(event) {
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
        event.stopPropagation();        
        var csrftoken = getCookie('csrftoken');

        var data_str = "";
        data_str += "enter_username"+"="+encodeURIComponent(document.getElementById("enter_username").value);
        data_str += "&";
        data_str += "password"+"="+encodeURIComponent(document.getElementById("password").value);
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "POST", 
            document.getElementById("auth_form").getAttribute("action"), 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function(){
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {   
                data = xhr.responseText
                if (data == "UNCORECT_USER")
                { 
                    auth_form_fail()                    
                    is_auth = true;
                }
                else
                {  
                    var reg_json = JSON.parse(data);
                    document.querySelector(reg_json.where).innerHTML = reg_json.what;
                }
            }
            
        }
        xhr.send(data_str);
        
        return false;
    });

    on("submit", "reg_form", function(event) 
    {
        event.preventDefault();
        event.stopPropagation();
        clearregform()
        var csrftoken = getCookie('csrftoken');

        var data_str = "";
        data_str += "username"+"="+encodeURIComponent(document.getElementById("reg_username").value);
        data_str += "&";
        data_str += "password1"+"="+encodeURIComponent(document.getElementById("password_1").value);
        data_str += "&";
        data_str += "password2"+"="+encodeURIComponent(document.getElementById("password_2").value);

        var xhr = new XMLHttpRequest();
        xhr.open( 
            "POST", 
            document.getElementById("reg_form").getAttribute("action"), 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                data = xhr.responseText
                //alert(data);
                var reg_json = JSON.parse(data)
                if ("username" in reg_json)
                {   
                    allmes_reg(reg_json)
                }
                if ("where" in reg_json && "what" in reg_json)
                { 
                    document.querySelector(reg_json.where).innerHTML = reg_json.what;
                }
                
            }

        }
        xhr.send(data_str);        
        return false;
    });

    on("submit", "logout", function(event) 
    {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        var csrftoken = getCookie('csrftoken');
        var data_str = "";
        data_str += "type_post"+"="+encodeURIComponent(document.querySelector("#type_post").value);
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "POST", 
            document.getElementById("logout").getAttribute("action"), 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                data = xhr.responseText                
                var reg_json = JSON.parse(data)
                document.querySelector(reg_json.where).innerHTML = reg_json.what;
            }

        }
        xhr.send(data_str);
        return false;
    });

    on("change", "reg_username", function(event) 
    {
        event.preventDefault();
        event.stopPropagation();
        clearregform_user()
                
        var csrftoken = getCookie('csrftoken');
        var data_str = "";
        data_str += "username"+"="+encodeURIComponent(document.getElementById("reg_username").value);
        data_str += "&";
        data_str += "password1"+"="+encodeURIComponent(document.getElementById("password_1").value);
        data_str += "&";
        data_str += "password2"+"="+encodeURIComponent(document.getElementById("password_2").value);
   
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "POST", 
            "/regform/", 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                data = xhr.responseText                
                var mes_json = JSON.parse(data);
                if(mes_json.username.status == 'ok')
                {
                    reg_user_sucses(mes_json)
                }

                if(mes_json.username.status == 'false')
                {
                    reg_user_fail(mes_json)
                }
            }

        }
        xhr.send(data_str);
        
        return false;
    });

    on("change", "password_div_1", function(event) 
    {
        event.preventDefault();
        event.stopPropagation();
        clearregform_pas1()

        var csrftoken = getCookie('csrftoken');
        var data_str = "";
        data_str += "username"+"="+encodeURIComponent(document.getElementById("reg_username").value);
        data_str += "&";
        data_str += "password1"+"="+encodeURIComponent(document.getElementById("password_1").value);
        data_str += "&";
        data_str += "password2"+"="+encodeURIComponent(document.getElementById("password_2").value);
   
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "POST", 
            "/regform/", 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                data = xhr.responseText
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

        }
        xhr.send(data_str);
        return false;
    });
    
    on("change", "password_div_2", function(event) 
    {
        event.preventDefault();
        event.stopPropagation();
        clearregform_pas1()
        clearregform_pas2()

        var csrftoken = getCookie('csrftoken');
        var data_str = "";
        data_str += "username"+"="+encodeURIComponent(document.getElementById("reg_username").value);
        data_str += "&";
        data_str += "password1"+"="+encodeURIComponent(document.getElementById("password_1").value);
        data_str += "&";
        data_str += "password2"+"="+encodeURIComponent(document.getElementById("password_2").value);
   
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "POST", 
            "/regform/", 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                data = xhr.responseText
                var mes_json = JSON.parse(data);
           
                if(mes_json.password1.status == 'ok' && mes_json.password2.status == 'ok')
                {
                    reg_pass1_sucses()
                    reg_pass2_sucses()
                }
                
                if(mes_json.password1.status == 'false')
                {
                    reg_pass1_fail(mes_json)
                    reg_pass2_fail(mes_json)
                }
            }

        }
        xhr.send(data_str);
        return false;
    });

    on("submit", "send_post", function(event) 
    {
        event.preventDefault();
        event.stopPropagation();
        
        var csrftoken = getCookie('csrftoken');
        var data_str = "";
        data_str += "new_twit_text"+"="+encodeURIComponent(document.getElementById("new_twit_text").value);
        
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "POST", 
            document.querySelector("#send_post").getAttribute("action"), 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                return;
            }
            else
            {
                data = xhr.responseText
                var twit_json = JSON.parse(data)
                add_twittolist(twit_json.id, twit_json.twit, twit_json.date)                
                document.getElementById("new_twit_text").value = ""
            }

        }
        xhr.send(data_str);
        return false;
    });

    on('click', 'a[href^=\\/twit\\/del]', function(event) 
    {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        
        var csrftoken = getCookie('csrftoken');
        var data_str = "";                
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "GET", 
            this.getAttribute("href"), 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                data = xhr.responseText
                var twit_json = JSON.parse(data);
                if ("del_twit" in twit_json )
                {                    
                    document.querySelector(twit_json.del_twit).remove()
                }
            }

        }
        xhr.send();
        return false;
    });

    on('click', 'a[href^=\\/twit\\/upd]', function(event) 
    {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();

        var id = this.getAttribute('id').match( /upd_(\d+)/i )[1];
        var last_twit;
        var csrftoken = getCookie('csrftoken');
        var data_str = "";                
        var xhr = new XMLHttpRequest();
        xhr.open( 
            "GET", 
            "twit/get/"+id, 
            true);

        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;
            if (this.status != 200) 
            { 
                alert( 'ERROR: ' + (this.status ? this.statusText : ' FUCK ') );
                return;
            }
            else
            {
                data = xhr.responseText
                var twit_json = JSON.parse(data);
                if ("twit" in twit_json )
                {                    
                    
                    last_twit = twit_json.twit
                    if(upd_twit_id == null && upd_twit_text == null)
                    {
                        edit_dict = upd_twitform(id, last_twit);
                        upd_twit_id = edit_dict['id'];
                        upd_twit_text = edit_dict['edit_twit'];

                        document.querySelector("#upd_"+upd_twit_id).style.display = "none"
                        document.querySelector("#del_"+upd_twit_id).style.display = "none"
                        document.querySelector("#twi_text_"+upd_twit_id).style.display = "none"
                    }
                    else
                    {          
                        edit_animate('#upd_twi_'+upd_twit_id, "#ff817f")
                        edit_animate('#upd_twi_'+upd_twit_id, "#ffffff")
                    }
                }
            }

        }
        xhr.send();


        
        
        return false;
    });

    on('click', 'button[id=confirm_twit_edit]', function(event) {
        event.preventDefault();
        event.stopPropagation();
        if( upd_twit_text == document.getElementById( 'upd_twi_'+upd_twit_id ).value )
        {
            twit_form_back(upd_twit_id, document.getElementById( 'twi_text_'+upd_twit_id ).innerHTML )
        }
        else
        {   
            new_twi = document.getElementById( 'upd_twi_'+upd_twit_id ).value
            twi_data = {
                "upd_id": upd_twit_id,
                "text_twit": new_twi  
            }       
            var csrftoken = getCookie('csrftoken');
            var data_str = "";
            data_str += "upd_id"+"="+upd_twit_id;
            data_str += "&";
            data_str += "text_twit"+"="+encodeURIComponent(new_twi);

            var xhr = new XMLHttpRequest();
            xhr.open( 
                "POST", 
                'twit/upd/', 
                true);

            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function()
            {

                if (this.readyState != 4) return;
                if (this.status != 200) 
                {   
                    alert('LALKA HUALKA ERROR')
                    twit_form_back(upd_twit_id, new_twi)
                }
                else
                {                    
                    data = xhr.responseText;
                    var mes_json = JSON.parse(data);
                    twit_form_back(upd_twit_id, mes_json.twit);
                }

            }
            xhr.send(data_str);
           
        }
        return false;
    });

    on('click', 'button[id=cansel_twit_edit]', function(event) {
        event.preventDefault();
        event.stopPropagation();

        twit_form_back(upd_twit_id, document.getElementById( 'twi_text_'+upd_twit_id ).innerHTML )
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
        var new_twit = '';
        new_twit += '<div class="row">';
        new_twit += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
        new_twit += '<p type="date" class="blog-post-meta">'+date+'</p>';
        new_twit += '</div>';
        new_twit += '<div align="right" class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
        new_twit += '<div>';
        new_twit += '<a id="upd_'+id+'" name="upd_'+id+'" href="/twit/upd/'+id+'"><span class="glyphicon glyphicon-pencil"></span></a>';
        new_twit += '<a id="del_'+id+'" name="del_'+id+'" href="/twit/del/'+id+'"><span class="glyphicon glyphicon-remove"></span></a>';
        new_twit += '</div>';
        new_twit += '</div>';
        new_twit += '</div>';
        new_twit += '<h3 id="twi_text_'+id+'">'+twit+'</h3>';

        var div_div = document.createElement('div');
        div_div.id = 'twit_'+id
        div_div.classList.add("blog-post")
        div_div.innerHTML = new_twit
        document.querySelector("#list_twit").appendChild(div_div);
    }

    function upd_twitform(id, last_twit)
    {
        //var id = id_link.match( /upd_(\d+)/i )[1];
        var new_form = ""
        new_form += '<input type="text" id="upd_twi_'+id+'" class="form-control form_post" value="'+last_twit+'">';
        new_form += '<button type="button" id="confirm_twit_edit" class="btn btn-default btn-sm form_margin_inl">Confirm changes</button>';
        new_form += '<button type="button" id="cansel_twit_edit" class="btn btn-default btn-sm form_margin_inl">Cancel</button>';

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
        document.querySelector(parent_id).animate(
        {
            backgroundColor: color

        }, 700 );
    }

    function getCookie(name) 
    {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
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