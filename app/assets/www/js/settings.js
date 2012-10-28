var Controllers = Controllers || {};

Controllers.Settings = can.Control({
    'init': function(element , options) {
        this.accounts = app.getAccounts();
        element.find(".name").replaceWith(can.view("js/views/name.ejs", {name: "Scrooge McDuck"}));
        this.listAccounts();
        var that = this;
        element.find("#add_account").bind("change", function(el, ev){
            var type = element.find(":selected").val();
            if(type){
                that.accounts.push({type: type, id: new Date().getTime()});
                that.listAccounts();
                element.find("option").first().attr("selected", "selected");
            }
        });
        element.find(".return").bind("tap", function(ev){
            $.mobile.changePage($("#transfer"));
        });
        element.find(".delete").live("tap", function(ev){
            ev.preventDefault();
            var id = $(ev.srcElement).closest("div.account").attr("id");
            var accounts = $.grep(that.accounts, function(account){
                return account.id != id;
            });
            window.localStorage.removeItem("account_"+id)
            that.accounts = accounts;
            that.listAccounts();
        });

        function getUserPassword() {
            return {
                username: element.find("#username").val(),
                password: element.find("#password").val()
            }
        }
        element.find(".save").live("tap", function(ev){
            ev.preventDefault();
            var element = $(ev.srcElement).closest("div.account");
            var id = element.attr("id");
            var account
            $.each(that.accounts, function(i, a){
                if(a.id == id){
                    account = a
                }
            });
            switch(account.type){
            case "beeone":
                account.login = getUserPassWord();
                account.name = element.find("#name").val();
                account.accountId = element.find("#accountId").val();
                break;
            case "bank":
                account.iban = element.find("#iban").val();
                break;
            }
            var json = JSON.stringify(account);
            window.localStorage.setItem("account_"+id, json)
        });
        element.find(".verify").live("tap", function(ev, el) {
            ev.preventDefault();
            var target = $(ev.target);
            var val = target.val();
            target.val("Verifying...").button("refresh").button("disable");
            beeone.config.login = getUserPassword();

            function resetButton() {
                target.val(val).button("refresh").button("enable");
            }
            Models.beeone.getAccounts(function(accounts) {
                    element.find("#accountName").val(beeone.config.name);
                    var select = element.find("select[name=accountId]");
                    var somethingFound = accounts && accounts.length > 0;

                    if (somethingFound) {
                        select.find("option").remove();
                    }
                    $.each(accounts, function(i, a) {
                        select.append("<option value='" + a.id + "'>" + a.iban + "</option>");
                    })
                    if (somethingFound) {
                        select.prop("disabled", false);
                        select.selectmenu("enable").selectmenu("refresh");
                    }
                    resetButton();
                }, function() {
                    resetButton();
                }
            );
        })
    },
    listAccounts: function(options){
        var that = this;
        var target = this.element.find("#accounts");
        target.empty();
        $.each(this.accounts, function(i, account){
            var view = "js/views/settings-"+account.type+".ejs"
            target.append(can.view(view, account));
        });
        this.element.trigger("create");
    }
})

