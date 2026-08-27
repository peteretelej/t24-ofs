/* as written by Peter Etelej (https://etelej.com) */
/* Project on Github: https://github.com/peteretelej/t24-ofs */
Vue.component("abbr-component",{
	template: "#t24abbrtemplate"
})

Vue.component("automsgs",{
	template:"#automsgsTemplate",
	data: function(){
		return {
			iserr:false,
			pageTransaction:true,
			pageEnquiry:false,
			t24app: "",t24vers:"",t24func:"",t24auth:"",t24process:"",
			t24user:"",t24pass:"",t24msgid:"",t24msgdata:"",
			t24company:"",t24replace:"",t24gts:"",
			getMessage:false
		}
	},
	methods:{
		resetVariables: function(){
			this.t24app = ""; this.t24vers=""
			this.t24func=""; this.t24auth="", this.t24process=""
			this.t24msgid=""; this.t24msgdata=""
			this.t24company="";this.t24replace="",this.t24gts=""

		},
		setPageTransaction: function(){
			this.pageTransaction = true
			this.pageEnquiry= false
			this.resetVariables()
		},
		setPageEnquiry: function(){
			this.pageEnquiry = true
			this.pageTransaction = false
			this.resetVariables()
			this.t24app = "ENQUIRY.SELECT"
		},
		disableMsg:function(){
			this.getMessage = false
		},
		generateMsg: function(){
			this.getMessage =true
			setTimeout(this.disableMsg,1500)
		},
		clearForm: function(){
			// Clear already generated OFS message
			this.getMessage = false;
			this.t24app = '';
			this.t24vers = '';
			this.t24func = '';
			this.t24auth = '';
			this.t24user = '';
			this.t24pass = '';
			this.t24company = '';
			this.t24msgid = '';
			this.t24msgdata = '';
			this.t24process = '';
			this.t24gts = '';
			this.t24replace = '';
			this.iserr = false;
		},
		goAutoMsg: function(){
			this.$emit("goAutoMsg")
		}
	},
	computed:{
		message: function(){
			var msg = ""
			this.iserr = false

			if (this.t24app === "" || this.t24user === "" || this.t24pass === ""){
				if (this.getMessage !== true){
					return ""
				}
			}

			if (this.t24app === ""){
				this.iserr = true
				this.getMessage = false
				return "Error: Application is required!"
			}

			if (this.t24user === "" || this.t24pass === ""){
				this.iserr = true
				this.getMessage = false
				return "Error: Username and password are required!"
			}

			var a = this.t24app.toUpperCase()
			var b = this.t24func.toUpperCase()

			msg += a+","
			msg +=this.t24vers+"/"
			msg += b+"/"
			msg += this.t24process 

			if (this.t24gts !=="" || this.t24auth !== ""){
				msg +="/"+this.t24gts
				if (this.t24auth !== ""){
					msg += "/"+this.t24auth
				}
			}

			msg += ","
			msg +=this.t24user
			msg +="/"+this.t24pass
			if (this.t24company !=="" || this.t24replace ==="YES"){
				msg += "/"+this.t24company
				if (this.t24replace === "YES"){
					msg +="///1"
				}

			}

			msg += ","
			// Handle special characters in id.
			// VERSION id in T24 is applicationName,versionName so replace , with ?. Example ACCOUNT,CURR will be ACCOUNT?CURR in OFS
			// BATCH & TSA.SERVICE id in T24 is companyMnemonic/id so replace / with ^. Example BNK/AC.EOD will be BNK^AC.EOD
			var transId = this.t24msgid
			transId = transId.replace(/,/g, "?");
			transId = transId.replace(/\//g, "^");
			msg += transId

			if (this.t24msgdata !== ""){
				msg += ","
				var t24msg = this.t24msgdata
				// replace special characters in message
				t24msg = t24msg.replace(/_/g, "'_'")
				t24msg = t24msg.replace(/\?/g,"%?%")	// ? is replacement of , but if its real ? then %?% preserves it
				t24msg = t24msg.replace(/\^/g,"%^%")	// ^ is replacement of / but if its real ^ then %^% preserves it
				t24msg = t24msg.replace(/\|/g,"%|%")	// | is replacement of " but if its real | then %|% preserves it
				t24msg = t24msg.replace(/"/g,"|")	
				msg +=t24msg
			}
			
			msg = msg.replace("//,","/,")
			msg = msg.replace("/,",",")
			msg = msg.trim()

			return msg
		}
	}
})

var vm = new Vue({
	el: "#app",
	data: {
		currentView: "automsgs",
		loaded:false
	},
	computed: {
		automsgspage: function(){
			return this.currentView==="automsgs"
		},
		abbrpage: function(){
			return this.currentView==="abbr-component"
		}
	}
})

var loadLag = function(){
	vm.loaded = true
}
setTimeout(loadLag,200)

/* Clipboard functionality */
new Clipboard(".clipBtn")

