import express from 'express';
import * as info from "./info.js"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

app.post('/customer/add/new', async (req, res) => {
    try {
        const data = req.body
        const check = await info.checkCustomer(data[0].phone)
        if (check.result === 0) {
            const added = await info.addNewCustomer(data[0].phone, data[0].name, data[0].aname)
            res.status(200).send(added.message)
        } else {
            res.status(400).send([{ message: "Customer already exists.", success: 0 }])
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.delete('/customer/:phoneNo', async (req, res) => {
    try {
        res.status(200).send((await info.deleteCustomer(req.params.phoneNo)).message)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.delete('/resceipt/:ID', async (req, res) => {
    try {
        res.status(200).send(await (await info.deleteReceipt(req.params.ID)).message)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.patch('/customer/update/name/', async (req, res) => {
    try {
        res.status(200).send((await info.updateCustomerName(req.body[0].phone, req.body[0].newName)).message)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.post('/receipt/add/new', async (req, res) => {
    try {
        const data = req.body
        const check = await info.checkReceipt(data[0].serial, data[0].date)
        if (check.result === 1) {
            const added = await info.addNewReceipt(data[0].serial, data[0].date, data[0].phone)
            res.status(200).send(added.message)
        } else {
            res.status(400).send([{ message: "Receipt already exists.", success: 0 }])
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.patch('/receipt/update/serial', async (req, res) => {
    try {
        let data = req.body
        let results = await info.checkReceipt(data[0].newSerial, data[0].date)
        if (results.result == 1) {
            res.status(200).send((await info.updateReciptSerial(data[0].id, data[0].newSerial)).message)
        } else {
            res.status(400).send([{ message: "Receipt serial and date already exists.", success: 0 }])
        }
    } catch (error) {
        res.status(500).send({ message: error.message, success: 0 })
    }
})

app.post('/customer/return/:phoneNo', async (req, res) => {
    try {
        res.status(200).send(await (await info.returnCustomer(req.params.phoneNo)).message)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.post('/receipt/return/:ID', async (req, res) => {
    try {
        res.status(200).send(await (await info.returnReceipt(req.params.ID)).message)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/customers', async (req, res) => {
    try {
        res.status(200).send(await info.getAllCustomers())
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/customers/deleted', async (req, res) => {
    try {
        res.status(200).send(await info.getDeletedCustomers())
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/receipts', async (req, res) => {
    try {
        res.status(200).send(await info.getAllReceipts())
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/receipts/deleted', async (req, res) => {
    try {
        res.status(200).send(await info.getDeletedReceipts())
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/customer/card/:phone_No', async (req, res) => {
    try {
        res.status(200).send(await info.customerCard(req.params.phone_No))
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/customer/card/details/:phone_No', async (req, res) => {
    try {
        res.status(200).send(await info.customerDetales(req.params.phone_No))
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/receipt/details/:id', async (req, res) => {
    try {
        res.status(200).send(await info.getReceiptById(req.params.id))
    } catch (error) {
        res.status(500).send({ errormessage: error.message, success: 0 })
    }
})

app.patch('/customer/update/arabicName/', async (req, res) => {
    try {
        res.status(200).send(await (await info.updateCustomerArabicName(req.body[0].phone_No, req.body[0].name)).message)
    } catch (error) {
        res.status(500).send({ errormessage: error.message, success: 0 })
    }
})

app.patch('/customer/update/phoneNumber', async (req, res) => {
    try {
        res.status(200).send(await (await info.updateCustomerPhoneNo(req.body[0].oldNumber, req.body[0].newNumber)).message)
    } catch (error) {
        res.status(500).send({ errormessage: error.message, success: 0 })
    }
})

app.get('/customer/phone-number/:number', async (req, res) => {
    try {
        res.status(200).send(await (await (info.getCustomerByPhoneNo(req.params.number))).data)
    } catch (error) {
        res.status(500).send({ errormessage: error.message, success: 0 })
    }
})

app.listen(5000 || proccess.env.PORT, () => console.log("The port started: 5000"))