package com.website.personaltrainer.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Data
@Table(name = "authorities")
public class Authority implements GrantedAuthority {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String authority;
    @ManyToOne(optional = false)
    private User user;

    public Authority() {}

    public Authority(String authority) {
        this.authority= authority;
    }
}
