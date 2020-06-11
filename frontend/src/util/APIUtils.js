import { API_BASE_URL, ACCESS_TOKEN } from '../constants';


const request = (options) => {
    const headers = new Headers({
        'Content-Type' : 'application/json',
    })

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);
    
    return fetch(options.url, options)
        .then(response => 
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        )
        .catch(err => {
            console.log(err)
        })
};

const requestFile = (options) => {
    const headers = new Headers({
        'Content-Type' : 'multipart/form-data',
    })

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, {
        method: options.method,
        body: options.data
    })
    .then(response =>  // 나중에 수정
        console.log("requestFile >>> "+response)
    )
};

const deleteRequest = (options) => {
    const headers = new Headers()

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function updateInfo(updateRequest) {
    // console.log(updateRequest.id);
    // console.log(updateRequest.username);
    // console.log(updateRequest.name);
    // console.log(updateRequest.email);
    // console.log(updateRequest.password);
    // console.log(updateRequest.phonenumber);
    // console.log(updateRequest.checked);
    // console.log(updateRequest.birthdate);

    return request(
        {
            url: API_BASE_URL + "/auth/updateuserinfo/"+updateRequest.id,
            method: 'PUT',
            body: JSON.stringify(updateRequest)
        }
    );
}

export function deleteUser(deleteRequest){
    // console.log(deleteRequest.id);
    // console.log(deleteRequest.username);
    // console.log(deleteRequest.name);
    // console.log(deleteRequest.email);
    // console.log(deleteRequest.password);
    // console.log(deleteRequest.phonenumber);
    // console.log(deleteRequest.checked);
    // console.log(deleteRequest.birthdate);

    return request(
        {
            url: API_BASE_URL + "/auth/deleteuserinfo/"+deleteRequest.id,
            method: 'DELETE',
            body: JSON.stringify(deleteRequest),
        }
    )
}

export function AddResort(info, length){

    // console.log(info.name);
    // console.log(info.location);
    // console.log(info.region);
    // console.log(info.intro);
    // console.log(info.pageLink);

    let formData = new FormData();
    formData.append('resortName', info.name);
    formData.append('location', info.location);
    formData.append('region', info.region);
    formData.append('intro', info.intro);
    formData.append('pageLink', info.pageLink);
    for(var i=0; i<length.resortImagelength; i++){
        formData.append("resortImages", info.resortImage[i]);
    }
    for(var j=0; j<length.liftImagelength; j++){
        formData.append("liftImages", info.liftImage[j]);
    }
    for(var k=0; k<length.rentalImagelength; k++){
        formData.append("rentalImages", info.rentalImage[k]);
    }
    for(var l=0; l<length.slopeImagelength; l++){
        formData.append("slopeImages", info.slopeImage[l]);
    }

    return requestFile({
        url : API_BASE_URL + "/ski/newResort",
        method: 'POST',
        data: formData
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/user/" + username,
        method: 'GET'
    });
}




// 리조트
export function getResortList(){
    return request({
        url: API_BASE_URL + "/ski/getResort",
        method: 'GET'
    });
}

export function getResort(resortId){
    return request({
        url: API_BASE_URL + "/ski/getResortById/"+ resortId,
        method: 'GET'
    });
}

export function getResortByRegion(region){
    return request({
        url: API_BASE_URL + "/ski/getResortByRegion/" + region,
        method: 'GET'
    });
}

export function getResortImageByType(resortId, imageType){
    return request({
        url: API_BASE_URL + '/ski/getResortImageByType/' + resortId + "/" + imageType,
        method: 'GET'
    })
}

export function getResortByLectureId(lectureId) {
    return request({
        url: API_BASE_URL + '/ski/getResortByLectureId/' + lectureId,
        method: 'GET'
    })
}
// 강습
export function getLectureList(){
    return request({
        url: API_BASE_URL + "/ski/getLecture",
        method: 'GET'
    })
}
// 강습+지역코드(region)
export function getLectureListByAllRegion(){
    return request({
        url: API_BASE_URL + "/ski/getLectureByAllRegion",
        method: 'GET'
    })
}

export function getLectureByRegion(regionId){
    return request({
        url: API_BASE_URL + "/ski/getLectureByRegion/" + regionId,
        method: 'GET'
    })
}

export function getLecture(lectureId){
    return request({
        url: API_BASE_URL + "/ski/getLectureById/" + lectureId,
        method: 'GET'
    })
}

export function getLectureByResortId(resortId){
    return request({
        url: API_BASE_URL + "/ski/getLectureByResortId/" + resortId,
        method: 'GET'
    });
}

export function getLectureImages(lectureId) {
    return request({
        url: API_BASE_URL + "/ski/getLectureImageByLectureId/" + lectureId,
        method: 'GET',
    });
}

export function getClassesInLecture(lectureId) {
    return request({
        url: API_BASE_URL + "/ski/getLectureInfoByLectureId/" + lectureId,
        method: 'GET',
    })
}

export function checkLectureCurrentAmount(lectureInfoId) {
    // console.log(lectureInfoId);
    return request({
        url: API_BASE_URL + "/register/checkLectureCurrentAmount/" + lectureInfoId,
        method: 'GET',
    })
}

export function registerLecture(registerRequest) {
    return request({
        url: API_BASE_URL + "/register/buyLecture/",
        method: 'POST',
        body: JSON.stringify(registerRequest)
    });
}

// 내 강습이력 리스트
export function getMyLectureList(userid) {
    return request({
        url: API_BASE_URL + "/register/myLectureList/"+userid,
        method: 'GET'
    });
}
// 내 강습이력 날짜추가 리스트
export function getMyLectureInfoList(userid) {
    return request({
        url: API_BASE_URL + "/register/myLectureInfoList/"+userid,
        method: 'GET'
    });
}

export function createLecture(info){
    let formData = new FormData();
    formData.append('instructorId', info.instructorId);
    formData.append('lectureName', info.lectureName);
    formData.append('lecturePrice', info.lecturePrice);
    formData.append('resortId', info.resortId);
    formData.append('lectureCapacity', info.lectureCapacity);
    formData.append('lectureDescription', info.lectureDescription);
    for(var i=0; i<info.timelength; i++){
        formData.append("lectureTime",info.lectureTime[i]);
    }
    for(var j=0; j<info.datelength; j++){
        formData.append("lectureDate",info.lectureDate[j]);
    }
    for(var k=0; k<info.fileslength; k++){
        formData.append("lectureImages",info.files[k]);
    }
    return requestFile({
        url : API_BASE_URL + "/ski/newLecture/" + info.resortId,
        method: 'POST',
        data: formData
    });
}

export function deleteLecture(lectureId) {
    return request({
        url: API_BASE_URL + "/ski/deleteLecture/" + lectureId,
        method: 'DELETE',
    })

}

export function updateLecture(info, lectureid){
    let formData = new FormData();
    formData.append('instructorId', info.instructorId);
    formData.append('lectureName', info.lectureName);
    formData.append('lecturePrice', info.lecturePrice);
    formData.append('resortId', info.resortId);
    formData.append('lectureCapacity', info.lectureCapacity);
    formData.append('lectureDescription', info.lectureDescription);
    for(var i=0; i<info.timelength; i++){
        formData.append("lectureTime",info.lectureTime[i]);
    }
    for(var j=0; j<info.datelength; j++){
        formData.append("lectureDate",info.lectureDate[j]);
    }
    for(var k=0; k<info.fileslength; k++){
        formData.append("lectureImages",info.files[k]);
    }
    return requestFile({
        url : API_BASE_URL + "/ski/updateLecture/" + lectureid,
        method: 'PUT',
        data: formData
    });
}

export function deleteLectureAllImage(lectureid){
    return request({
        url: API_BASE_URL + "/ski/deleteLectureImageByLectureId/" + lectureid,
        method: 'DELETE'
    });
}

export function setReview(comments, lectureid, userid) {
    return request({
        url: API_BASE_URL + "/comment/addComment/" + lectureid + "/" + userid,
        method: 'POST',
        body: JSON.stringify(comments)
    });
}

export function deleteReview(commentId) {
    return request({
        url: API_BASE_URL + "/comment/deleteComment/" + commentId,
        method: 'DELETE'
    });
}

export function getReviewByLectureId(lectureId) {
    return request({
        url: API_BASE_URL + "/comment/getCommentByLecId/" + lectureId,
        method: 'GET'
    });    
}

export function getAllReview() {
    return request({
        url: API_BASE_URL + "/comment/getAllComment",
        method: 'GET'
    });    
}

// 후기
export function uploadComment(id, username, comment){
    const formData = new FormData();
    formData.append('user', username);
    formData.append('comment', comment);
    return request({
        url: API_BASE_URL + "/saveComment/" + id,
        method: 'POST',
        body: formData
    });
}

export function getComment(id){
    return request({
        url : API_BASE_URL + "/getComment/" + id,
        method: 'GET'
    });
}

export function fetchRate(id, user){
    return request({
        url : API_BASE_URL + "/fetchRate/" + id + "/" + user,
        method: 'GET'
    });
}

export function getAvgRate(id){
    return request({
        url : API_BASE_URL + "/getAvgRate/" + id,
        method: 'GET'
    });
}