import request, { post } from '../utils/request';

export const fetch_student = query => {
    console.log("this.query:",query);
    return post("/studentInfo/searchInfo",query);
};
export const update_student_info = data => {
    console.log(data);
    return post("/studentInfo/uptadeInfo",data);
};
export const add_student  = data => {
    console.log(data);
    return post("/studentInfo/addInfo",data);
};
export const fetch_grade  = data => {
    console.log(data);
    return post("/ClassGradeInfo/search",data);
};
export const update_grade  = data => {
    console.log(data);
    return post("/ClassGradeInfo/insert",data);
};
export const fetch_grade_makeup  = data => {
    console.log(data);
    return post("/ClassGradeInfo/searchMakeup",data);
};
export const update_grade_makeup  = data => {
    console.log(data);
    return post("/ClassGradeInfo/insertMakeup",data);
};
export const fetch_data_with_credit  = data => {
    console.log(data);
    return post("/StudentInfoWithCredit/search",data);
};
export const update_status  = data => {
    console.log(data);
    return post("/Status/updateStatus",data);
};
export const fetch_major  = data => {
    console.log(data);
    return post("/getMajor",data);
};
export const fetch_log  = data => {
    console.log(data);
    return post("/getLog",data);
};