import mysql from "mysql2"

const pool = mysql.createPool({
    // host: "localhost",
    // user: "root",
    // database: "tailor",
    // password: "",
    // dateStrings: true

    host: "sql8.freesqldatabase.com",
    user: "sql8817821",
    database: "sql8817821",
    password: "5RGH5bZFHk",
    port: 3306,
    dateStrings: true
    
}).promise()

export const checkCustomer = async phone => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM customer WHERE phone_No = ?`,
        [phone]
    );

    const result = rows[0].count >= 1 ? 1 : 0;
    return { result };
}

export const addNewCustomer = async (phone, nAme, aName) => {
    var message = []
    await pool.query(`INSERT INTO customer (phone_No, name, aname) VALUES (${phone}, '${nAme}', '${aName}');`)
    message.push(
        {
            "message": "Customer added successfuly.",
            "success": 1
        }
    )
    return { message }
}

export const deleteCustomer = async phone => {
    await pool.query("UPDATE customer SET BLOCK = 1 WHERE phone_No = ?", [phone])
    var message = [{ "message": "The customer has been deleted", "success": 1 }]
    return { message }
}

export const deleteReceipt = async id => {
    let [sql] = await pool.query("UPDATE receipt SET BLOCK = 1 WHERE ID = ?", [id])
    var messages, message
    messages = [
        { "message": "The receipt has been deleted.", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    message = sql.changedRows == 1 ? messages[0] : messages[1]
    return { message }
}

export const updateCustomerName = async (phone, newName) => {
    var [sql] = await pool.query("UPDATE customer SET name = ? WHERE phone_No = ?", [newName, phone])
    var messages = [
        { "message": "The customer name has been changed", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    var message = sql.changedRows == 1 ? messages[0] : messages[1]
    return { message }
}

export const checkReceipt = async (serial, date) => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count, r_date FROM receipt WHERE serial_No = ? && r_date = ?`,
        [serial, date]
    );

    let result = 0;
    result = rows[0].count >= 1 ? 0 : 1;
    return { result };
}

export const addNewReceipt = async (serial, date, phone) => {
    var [sql] = await pool.query("INSERT INTO receipt (serial_NO, r_date, customer_PhoneNo) VALUES (?, ?, ?)", [serial, date, phone])
    var messages = [
        { "message": "The receipt add successfuly.", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    var message = sql.affectedRows == 1 ? [messages[0]] : [messages[1]]
    return { message }
}

export const updateReciptSerial = async (id, newSerial) => {
    let [sql] = await pool.query("UPDATE receipt SET serial_No = ? WHERE ID = ?", [newSerial, id],)
    var messages, message
    messages = [
        { "message": "The receipt serial has been updated.", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    message = sql.changedRows == 1 ? messages[0] : messages[1]
    return { message }
}

export const returnCustomer = async phone => {
    let [sql] = await pool.query("UPDATE customer SET BLOCK = 0 WHERE phone_No = ?", [phone])
    var messages, message
    messages = [
        { "message": "The customer has been return.", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    message = sql.changedRows == 1 ? [messages[0]] : [messages[1]]
    return { message }
}

export const returnReceipt = async id => {
    let [sql] = await pool.query("UPDATE receipt SET BLOCK = 0 WHERE ID = ?", [id])
    var messages, message
    messages = [
        { "message": "The receipt has been return.", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    message = sql.changedRows == 1 ? [messages[0]] : [messages[1]]
    return { message }
}

export const getAllCustomers = async () => {
    let [sql] = await pool.query("SELECT * FROM customer WHERE BLOCK = 0 ORDER BY phone_No DESC");
    let data = sql
    return { data }
}


export const getDeletedCustomers = async () => {
    let [sql] = await pool.query("SELECT * FROM customer WHERE BLOCK = 1");
    let data = []

    for (var i = 0; i <= sql.length - 1; i++) {
        let phoneNo = sql[i].phone_No
        let [receipt] = await pool.query(
            "SELECT * FROM receipt WHERE customer_PhoneNo = ? AND BLOCK = 0 ORDER BY serial_NO DESC LIMIT 1",
            [phoneNo]
        );
        receipt.length > 0 ?
            data.push({
                "name": sql[i].name,
                "aname": sql[i].aname,
                "phone_No": sql[i].phone_No,
                "last_receipt": receipt[0].serial_NO,
                "receipt_date": receipt[0].r_date,
                "receiptFound": 1,
            }) :
            data.push({
                "name": sql[i].name,
                "aname": sql[i].aname,
                "phone_No": sql[i].phone_No,
                "message": "This customer have no receipts!",
                "receiptFound": 0,
            })
    }
    return { data }
}

export const getAllReceipts = async () => {
    let [sql] = await pool.query("SELECT * FROM receipt WHERE BLOCK = 0 ORDER BY r_date DESC");
    let data = []

    for (var i = 0; i < sql.length; i++) {
        let [customer] = await pool.query(`SELECT COUNT(phone_No) AS count FROM customer WHERE phone_No = ${sql[i].customer_PhoneNo} AND BLOCK = 0`)
        if (customer[0].count == 1) {
            data.push(sql[i])
        } else { continue; }
    }

    return { data }
}

export const getDeletedReceipts = async () => {
    let [sql] = await pool.query("SELECT * FROM receipt WHERE BLOCK = 1");
    let data = sql
    return { data }
}

/* This next functions hse added after finishing the backend */
export const customerCard = async (phone_No) => {
    let [sql] = await pool.query("SELECT * FROM customer WHERE phone_No = ? AND BLOCK = 0", [phone_No])
    let data = []
    let phoneNo = sql[0].phone_No
    let [receipt] = await pool.query(
        "SELECT * FROM receipt WHERE customer_PhoneNo = ? AND BLOCK = 0 ORDER BY serial_NO DESC LIMIT 1",
        [phoneNo]
    );
    receipt.length > 0 ?
        data.push({
            "name": sql[0].name,
            "aname": sql[0].aname,
            "phone_No": sql[0].phone_No,
            "last_receipt": receipt[0].serial_NO,
            "receipt_date": receipt[0].r_date,
            "receiptFound": 1,
        }) :
        data.push({
            "name": sql[0].name,
            "aname": sql[0].aname,
            "phone_No": sql[0].phone_No,
            "message": "This customer have no receipts!",
            "receiptFound": 0,
        })

    return { data }
}

export const customerDetales = async (phone_No) => {
    let [sql] = await pool.query("SELECT * FROM customer WHERE phone_No = ? AND BLOCK = 0", [phone_No])
    let data = []
    let phoneNo = sql[0].phone_No
    let [receipt] = await pool.query(
        "SELECT * FROM receipt WHERE customer_PhoneNo = ? AND BLOCK = 0 ORDER BY serial_NO DESC",
        [phoneNo]
    );

    receipt.length > 0 ?
        data.push({
            "name": sql[0].name,
            "aname": sql[0].aname,
            "phone_No": sql[0].phone_No,
            "last_receipt": receipt[0].serial_NO,
            "receipts": receipt,
            "receipt_date": receipt[0].r_date,
            "receiptFound": 1,
        }) :
        data.push({
            "name": sql[0].name,
            "aname": sql[0].aname,
            "phone_No": sql[0].phone_No,
            "message": "This customer have no receipts!",
            "receiptFound": 0,
        })

    return { data }
}

export const getReceiptById = async (id) => {
    let [sql] = await pool.query("SELECT * FROM receipt WHERE ID = ?", [id])
    let data = []
    sql.length > 0 ?
        data.push({
            "ID": sql[0].ID,
            "serial_NO": sql[0].serial_NO,
            "date": sql[0].r_date,
            "customer_No": sql[0].customer_PhoneNo,
            "Delete": sql[0].BLOCK,
            "success": 1
        }) :
        data.push({
            "message": "There is no receipt found!",
            "success": 0,
        })
    return data
}

export const updateCustomerArabicName = async (phone_No, newName) => {
    let [sql] = await pool.query("UPDATE customer SET aname = ? WHERE phone_No = ?", [newName, phone_No])
    var messages, message
    messages = [
        { "message": "The customer name has been updated.", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    message = sql.changedRows == 1 ? messages[0] : messages[1]
    return { message }
}

export const updateCustomerPhoneNo = async (oPh, nPh) => {
    let [sql] = await pool.query("UPDATE customer SET phone_No = ? WHERE phone_No = ?", [nPh, oPh])
    var messages, message
    messages = [
        { "message": "The customer phone number has been updated.", "success": 1 },
        { "message": "Somthing wont woring!", "success": 0 }
    ]
    message = sql.changedRows == 1 ? messages[0] : messages[1]
    return { message }
}

export const getCustomerByPhoneNo = async (phoneNo) => {
    let [sql] = await pool.query("SELECT * FROM customer WHERE phone_No = ? AND BLOCK = 0", [phoneNo])
    let data = sql
    return { data }
}
