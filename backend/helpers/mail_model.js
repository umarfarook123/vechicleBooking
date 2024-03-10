var nodemailer = require('nodemailer');

exports.sendMail = (to = '', template = '', replacable = {}, callback) => {


	siteSettings.findOne(async (err, siteSettingsData) => {


		await emailtemplate.findOne({ 'name': template, 'language': 1 }, (err, templateData) => {

			var newSubject = templateData.subject;
			var newTemplate = templateData.template;
			var defaultReplacables = {};
			defaultReplacables['###COMPANYNAME###'] = siteSettingsData.siteName;
			defaultReplacables['###SITENAME###'] = siteSettingsData.siteName;
			defaultReplacables['###COPYRIGHT###'] = siteSettingsData.copyright;
			defaultReplacables['###ADDRESS###'] = siteSettingsData.address;
			defaultReplacables['###SITELOGO###'] = siteSettingsData.siteLogo;
			defaultReplacables['###PHONE###'] = siteSettingsData.phone_number;
			defaultReplacables['###INSTA###'] = siteSettingsData.instagram_url;
			defaultReplacables['###FACEBOOK###'] = siteSettingsData.facebook_url;
			defaultReplacables['###TWITTER###'] = siteSettingsData.twitter_url;
			defaultReplacables['###TELEGRAM###'] = siteSettingsData.telegramlink;

			for (let defaultReplace in defaultReplacables) {
				let re = new RegExp(defaultReplace, 'g');
				newTemplate = newTemplate.replace(re, defaultReplacables[defaultReplace]);
			}

			for (let replace in replacable) {
				let re = new RegExp(replace, 'g');

				newTemplate = newTemplate.replace(re, replacable[replace]);




			}

			for (let replace in replacable) {
				let re = new RegExp(replace, 'g');
				newSubject = newSubject.replace(re, replacable[replace]);
			}



			// var transporter = nodemailer.createTransport({
			// 	host: encrypt_decrypt.decrypt(smptConfig.smtp_host),
			// 	port: encrypt_decrypt.decrypt(smptConfig.smtp_port),// encrypt_decrypt.decrypt("jX0y0kzo1NvvIvnMa8k4kw=="),
			// 	secure: false,
			// 	auth: {
			// 		user: encrypt_decrypt.decrypt(smptConfig.smtp_email),
			// 		pass: encrypt_decrypt.decrypt(smptConfig.smtp_password),
			// 	},
			// });



			var transporter = nodemailer.createTransport({
				host: config.SMTP_HOST,
				port: config.SMTP_port,// common.decrypt("jX0y0kzo1NvvIvnMa8k4kw=="),
				secure: false,
				auth: {
					user: config.SMTP_user,
					pass: config.SMTP_pass,
				},
			});



			var mailOptions = {
				from: config.SMTP_fromAddress,
				to: to,
				bcc: '',
				subject: newSubject,
				html: newTemplate
			};



			transporter.sendMail(mailOptions, function (error, info) {

				if (error) {
					const errors = error;
					callback(errors);
				} else {

					callback(true);
				}

			});


		});

	});

}

exports.sendMail2 = async (to = '', template = '', replacable = {}, subject = '') => {


	try {



		let siteSettingsData = await siteSettings.findOne();
		let templateData = await emailtemplate.findOne({ 'name': template, 'language': 1 });

		var newSubject = templateData.subject;
		var newTemplate = templateData.template;
		var defaultReplacables = {};
		defaultReplacables['###COMPANYNAME###'] = siteSettingsData.siteName;
		defaultReplacables['###SITENAME###'] = siteSettingsData.siteName;
		defaultReplacables['###COPYRIGHT###'] = siteSettingsData.copyright;
		defaultReplacables['###ADDRESS###'] = siteSettingsData.address;
		defaultReplacables['###SITELOGO###'] = siteSettingsData.siteLogo;
		defaultReplacables['###PHONE###'] = siteSettingsData.phone_number;

		defaultReplacables['###facebook###'] = siteSettingsData.facebook;
		defaultReplacables['###instagram###'] = siteSettingsData.instagram;
		defaultReplacables['###youtube###'] = siteSettingsData.youtube;
		defaultReplacables['###twitter###'] = siteSettingsData.twitter;
		defaultReplacables['###telegram###'] = siteSettingsData.telegram;
		defaultReplacables['###discord###'] = siteSettingsData.discord;
		defaultReplacables['###tiktok###'] = siteSettingsData.tiktok;
		defaultReplacables['###line###'] = siteSettingsData.line;
		defaultReplacables['###pinterest###'] = siteSettingsData.pinterest;
		defaultReplacables['###talk###'] = siteSettingsData.talk;

		for (let defaultReplace in defaultReplacables) {
			let re = new RegExp(defaultReplace, 'g');
			newTemplate = newTemplate.replace(re, defaultReplacables[defaultReplace]);
		}

		for (let replace in replacable) {
			let re = new RegExp(replace, 'g');
			newTemplate = newTemplate.replace(re, replacable[replace]);

		}

		for (let replace in replacable) {
			let re = new RegExp(replace, 'g');
			newSubject = newSubject.replace(re, replacable[replace]);
		}



		var transporter = nodemailer.createTransport({
			host: config.SMTP_HOST,
			port: config.SMTP_port,// common.decrypt("jX0y0kzo1NvvIvnMa8k4kw=="),
			secure: false,
			auth: {
				user: config.SMTP_user,
				pass: config.SMTP_pass,
			},
		});



		var mailOptions = {
			from: config.SMTP_fromAddress,
			to: to,
			bcc: '',
			subject: subject,
			html: newTemplate
		};

		let infoMail = await transporter.sendMail(mailOptions)
		console.log("infoMail: ", infoMail);


		return infoMail;


	}
	catch (err) {
		console.log("exports.sendMail2= ~ err:", err.message)
		return false
	}

}


exports.sendMobileOTP = async (message, to) => {


	try {


		console.log("exports.sendMobileOTP= ~ config.twillo_fromNumber:", config.twillo_fromNumber)
		let smsInfo = await client.messages.create({ body: message, from: config.twillo_fromNumber, to: to })
		console.log("exports.sendMobileOTP= ~ smsInfo:", smsInfo)
		return smsInfo;


	}
	catch (err) {
		console.log("exports.sendMobileOTP= ~ err:", err)

		console.log("exports.sendMail2= ~ err:", err.message)
		return false
	}

}