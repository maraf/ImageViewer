var Authentication = function () {
    this._currentToken = null;

    this.OnCurrentTokenChanged;


    document.getElementById("frm-login").addEventListener("submit", this._OnLoginSubmit.bind(this));
};

Authentication.prototype._OnLoginSubmit = function (e) {
    var form = e.target;
    var formData = new FormData(form);

    var xhr = new XMLHttpRequest();
    xhr.onload = this._OnLoginCompleted.bind(this);
    xhr.open("POST", form.action);
    xhr.send(formData);

    e.preventDefault();
};

Authentication.prototype._OnLoginCompleted = function (e) {
    var xhr = e.target;
    if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.token !== null) {
            this._currentToken = response.token;
            this.Hide();

            if (typeof (this.OnCurrentTokenChanged) === "function") {
                this.OnCurrentTokenChanged();
            }
        }
    } else if (xhr.status === 401) {
        this._GetErrorMessage().show();
    }
};

Authentication.prototype.GetCurrentToken = function () {
    return this._currentToken;
};

Authentication.prototype.Show = function () {
    this._GetErrorMessage().hide();
    this._GetModal().modal('show');
};

Authentication.prototype.Hide = function () {
    this._GetModal().modal('hide');
};

Authentication.prototype._GetModal = function () {
    return $("#dlg-login");
};

Authentication.prototype._GetErrorMessage = function () {
    return $("#dlg-login-error-message");
};
