package com.getski.payload;

public class UserProfile{
    private Long id;
    private String username;
    private String email;
    private String name;
    private String phonenumber;
    private boolean checked;
    private String birthdate;

    public UserProfile(Long id, String username, String name,String email, String phonenumber,boolean checked, String birthdate){
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.phonenumber = phonenumber;
        this.checked = checked;
        this.birthdate=birthdate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public boolean isChecked() {
        return checked;
    }
    //
    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}