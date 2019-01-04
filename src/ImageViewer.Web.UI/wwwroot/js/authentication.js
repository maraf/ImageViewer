var Authentication = function () {
    this._loginUrl = document.body.dataset['loginUrl'];
    this._currentToken = null;

    this.OnCurrentTokenChanged;


    document.getElementById("frm-login").addEventListener("submit", this._OnFormSubmit.bind(this));
};

Authentication.prototype._OnFormSubmit = function (e) {
    var formData = new FormData();
    formData.append("login", document.getElementById("dlg-login-login").value);
    formData.append("password", document.getElementById("dlg-login-password").value);

    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (response.token !== null) {
            this._currentToken = response.token;
            this.Hide();

            if (typeof (this.OnCurrentTokenChanged) === "function") {
                this.OnCurrentTokenChanged();
            }
        }
    }.bind(this);

    xhr.open("POST", this._loginUrl);
    xhr.send(formData);

    e.preventDefault();
};

Authentication.prototype.GetCurrentToken = function () {
    return this._currentToken;
};

Authentication.prototype.Show = function () {
    this._GetModal().modal('show');
};

Authentication.prototype.Hide = function () {
    this._GetModal().modal('hide');
};

Authentication.prototype._GetModal = function () {
    return $("#dlg-login");
};
