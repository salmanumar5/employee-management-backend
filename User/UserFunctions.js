var express = require("express");
var moncon = require("../config/mongo-connect");
const fs = require('fs').promises;
var mongoose = require("mongoose");
const md5 = require("md5");
const { Response, Fail } = require("../constants/response");
const GeneralInfoModel = require("./UserModel");
const puppeteer = require('puppeteer');
const path = require('path');
const moment = require('moment');
const handlebars = require('handlebars');
const { log } = require("console");


var app = express();



const registerGeneralDetails = async (req, res) => {

    const { personalEmail, mobileNumber } = req.body


    console.log(req.body)

    // return 
    try {
        GeneralInfoModel.findOne({
            personalEmail: personalEmail,
            mobileNumber: mobileNumber
        }).then((check) => {
            if (check === null) {

                var preJSON = {
                    _id: new mongoose.Types.ObjectId(),
                    created_at: Date.now(),
                    updated_at: Date.now(),
                };

                var final_request = Object.assign(req.body, preJSON);
                var GeneralInfoModelSave = new GeneralInfoModel(final_request);

                GeneralInfoModelSave.save().then((doc) => {
                    console.log(doc);
                    if (doc !== null) {
                        Response(doc, res);
                    } else {
                        res.status(200).send({ message: "somthing went wrong", status: 205 });
                    }
                });
            } else {

                res.status(200).send({ message: "Already exists", status: 400 });
            }
        });

    } catch (error) {
        Fail(true, "Error received", res, 404);

    }


};

const getAllGeneralInfoModels = async (req, res) => {


    console.log(req.body)
    const options = {
        page: req.body.page,
        limit: req.body.limit,
        collation: {
            locale: 'en',
        },
        populate: ""
    };

    try {
        GeneralInfoModel.paginate(req.body.search, options, function (err, doc) {
            if (doc !== null) {
                Response(doc, res);
            } else {
                Fail(true, "No Data", res, 201);
            }
        });
    } catch (error) {
        Fail(true, "something went wrong", res, 404);

    }

};


// Update GeneralInfoModel by ID
const updateGeneralInfoModelById = async (GeneralInfoModelId, updateData) => {
    try {
        const updatedGeneralInfoModel = await GeneralInfoModel.findByIdAndUpdate(GeneralInfoModelId, updateData, { new: true });
        console.log('GeneralInfoModel updated:', updatedGeneralInfoModel);
        return updatedGeneralInfoModel;
    } catch (error) {
        console.error('Error updating GeneralInfoModel:', error);
        throw error;
    }
};

const deleteGeneralInfoModelById = async (req, res) => {
    const { id } = req.body

    try {
        const deleteOperation = await GeneralInfoModel.findByIdAndDelete(id);


        console.log('deleted:', deleteOperation);


        if (deleteOperation !== null || deleteOperation !== undefined) {
            res.status(200).send({ message: "Success", status: 200 })
        } else {
            res.status(200).send({ message: "no data found", status: 200 })

        }
    } catch (error) {
        console.error('Error deleting GeneralInfoModel:', error);
    }
};

// Function to generate PDF using Puppeteer
const generateEmployeePdf = async (id) => {
    try {
        const data = await GeneralInfoModel.findById(id);

        if (!data) {
            console.log('Data not found');
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const filePath = path.resolve(__dirname, "../templates", "offer-letter.html")

        const fileData = await fs.readFile(filePath, "utf8")

        const handlebarCompiler = handlebars.compile(fileData)

        const html = handlebarCompiler({
            fullName: data.fullName,
            role: data?.role,
            team: data?.team,
            joiningDate: data?.joiningDate,
            reportingManager: data?.reportingManager,
            monthlyGrossSalary: data?.monthlyGrossSalary,
            annualGrossSalary: data?.annualGrossSalary,
            probation: data?.probation,
            noticePeriod: data?.noticePeriod,
        })


        await page.setContent(html)
        // await page.emulateMedia('screen');

        await page.pdf({
            path: `offer-letter-${id}.pdf`,
            format: 'A4',
            printBackground: true
        });
        await browser.close();
        console.log('PDF generated successfully');
        let success = true
        return success
    } catch (error) {
        console.error('Error generating PDF:', error);
        let err = true
        return err

    }
};

const sendPDFToREACT = async (req, res) => {
    const { id } = req.body;
    try {
        const check = await generateEmployeePdf(id);
        console.log({ check });

        if (check) {
            const filePath = path.join(process.cwd(), `offer-letter-${id}.pdf`);
            console.log({ filePath });

            // Send the file as a response
            res.download(filePath, async (err) => {
                if (err) {
                    console.error('Error sending the PDF:', err);
                    res.status(500).json({ error: 'Error sending PDF' });
                } else {
                    // Delete the file after sending it
                    try {
                        await fs.unlink(filePath);
                        console.log('PDF file deleted successfully');
                    } catch (deleteError) {
                        console.error('Error deleting the PDF file:', deleteError);
                    }
                }
            });
        } else {
            res.status(500).json({ error: 'Error generating PDF' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error generating PDF' });
    }
};


// });




var sendPDFToREACTRoutes = (router) => {
    router.post("/sendPDFToREACT", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        sendPDFToREACT(req, res);
    });
};





var RegisterRoutes = (router) => {
    router.post("/registerGeneralDetails", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        registerGeneralDetails(req, res);
    });
};

var getUsersRoutes = (router) => {
    router.post("/getGeneral-Info", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        getAllGeneralInfoModels(req, res);
    });
};

var changePasswordRoutes = (router) => {
    router.post("/changePassword", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        changePassword(req, res);
    });
};
var checkPANRoutes = (router) => {
    router.post("/checkPAN", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        checkPAN(req, res);
    });
};

var UserRemoveRoutes = (router) => {
    router.post("/generalInfo/remove", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        deleteGeneralInfoModelById(req, res);
    });
};

var PdfRouter = async (router) => {
    router.post('/generate-pdf', async (req, res) => {
        const { id } = req.body;
        console.log(req.body);
        moncon.connectTodb("HOA");
        await generateEmployeePdf(id);
        res.sendStatus(200); // Respond with success status
    });
}

var UserUpdateRoutes = (router) => {
    router.post("/UserUpdate", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        UserUpdate(req, res);
    });
};

var LoginRoutes = (router) => {
    router.post("/Login", (req, res) => {
        console.log(req.body);
        moncon.connectTodb("HOA");
        Login(req, res);
    });
};

module.exports = {
    RegisterRoutes,
    getUsersRoutes,
    changePasswordRoutes,
    UserRemoveRoutes,
    UserUpdateRoutes,
    LoginRoutes,
    UserUpdateRoutes,
    UserUpdateRoutes,
    checkPANRoutes,
    PdfRouter,
    sendPDFToREACTRoutes
};
