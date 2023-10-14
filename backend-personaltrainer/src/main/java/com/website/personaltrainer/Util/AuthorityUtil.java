package com.website.personaltrainer.Util;

import com.website.personaltrainer.Model.User;

public class AuthorityUtil {

    public static Boolean hasRole(String role, User user){
        return user.getAuthorities()
                .stream().anyMatch(auth -> auth.getAuthority().equals(role));
    }
}
