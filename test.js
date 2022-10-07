// const convert = (string) => {

// const new_string = string.replace("https://drive.google.com/file/d/", "")
// const another = new_string.replace("/view?usp=sharing","")
// return another
// }


// console.log(convert("https://drive.google.com/file/d/1KbFfNvBnOnVS8Y4jXLf39JmKujR2_isy/view?usp=sharing"))


const csvFilePath='./assets/img/table.csv'
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    console.log(jsonObj);
   
})