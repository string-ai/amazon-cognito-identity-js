export default class RequestFetch {
    constructor() {
        this.url = "https://cognito-idp.eu-west-1.amazonaws.com/";
    }

    makeUnauthenticatedRequest(operation, params, callback) {
        fetch(this.url, {
            method: 'post',
            headers: {
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.' + operation,
                'Content-Type': 'application/x-amz-json-1.1'
            },
            body: JSON.stringify(params)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            if (result && result !== {}) {
                callback(null, result);
            } else {
                callback(null);
            }
        })
        .catch (function (error) {
            callback(error, null);
        });        
    }
}
