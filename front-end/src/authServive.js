class Auth {
 

    isAuthenticated() {
        const islogin = localStorage.getItem("isLoggedIn");

        if (!islogin || islogin == undefined) {
            return false
        }
        if (islogin == true) {
            return true;
        }

console.log("isAuthenticated______" +islogin )
    };

};

const auth = new Auth();
export default auth;
