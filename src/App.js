App = {
  contracts: {},
  load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
  },

  loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
      } else {
      window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
      } catch (error) {
          // User denied account access...
      }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
  },

  loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
  
      console.log(App.account);
  },

  loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const verifyMe = await $.getJSON('VerifyMe.json')
      App.contracts.VerifyMe = TruffleContract(verifyMe)
      App.contracts.VerifyMe.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.verifyMe = await App.contracts.VerifyMe.deployed()
    },

    render: async () => {    
      // Render Account
      console.log(App.account);
      await App.checkUser();
    },

    checkUser: async () => {
      const user = await App.verifyMe.users(App.account);
      console.log(user);
      if(user[1] != ''){
        console.log('Exists');
        App.renderMySkills();
        App.renderAllSkills();
      } else {
        console.log('New');
        $('#newUserModal').modal('show');
      }
    },
    
    createUser: async () => {
      uname = $('#userName').val();
      uemail = $('#userEmail').val();
      await App.verifyMe.setEmail(uemail, uname,{from:App.account,gas:3000000})
      window.location.reload()
    },

    addSkill: async () => {
      sname = $('#skillName').val();
      slevel = $('input[name="skillLevel"]:checked').val();
      await App.verifyMe.addSkill(sname, slevel,{from:App.account,gas:3000000})
      $('#skillName').val('');
      Swal.fire({
        icon: 'success',
        title: 'Skill Added successfully',
        confirmButtonText: 'Cool',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        } 
      })
    },

    renderMySkills: async () => {
      const skillCount = await App.verifyMe.skillCount();
      const $mmyskillTemplate = $('.myskillTemplate')
      for (let index = 0; index < skillCount['c'][0]; index++) {
        const skill = await App.verifyMe.skills(index);
        console.log(skill)
        if(skill[4] == App.account){
          const $myskilltemp = $mmyskillTemplate.clone()
          $myskilltemp.find('.myskill_name').html(skill[1])
          $myskilltemp.find('.myskill_level').html(skill[2]['c'][0])
          $myskilltemp.find('.myskill_end').html(skill[3]['c'][0])
          $('#mySkills').append($myskilltemp);
          $myskilltemp.show()
        }
        
      }
    },
    renderAllSkills: async () => {
      const skillCount = await App.verifyMe.skillCount();
      const $skillTemplate = $('.skillTemplate')
      for (let index = 0; index < skillCount['c'][0]; index++) {
        const skill = await App.verifyMe.skills(index);
        if(skill[4] != App.account){
          const $skilltemp = $skillTemplate.clone()
          const user = await App.verifyMe.users(skill[4])
          $skilltemp.find('.skill_user_name').html(user[1])
          $skilltemp.find('.skill_user_email').html(user[3])
          $skilltemp.find('.skill_name').html(skill[1])
          $skilltemp.find('.skill_level').html(skill[2]['c'][0])
          $skilltemp.find('.skill_end').html(skill[3]['c'][0])
          $skilltemp.find('.endor').html(`<button class="btn btn-primary" onClick="App.endorseSkill(`+index+`)">Endorse</button>`)
          $('#Skills').append($skilltemp);
          $skilltemp.show()
        }
        
      }
    },
    endorseSkill: async (index) => {
      try {
        await App.verifyMe.endorseSkill(index,{from:App.account,gas:3000000})
        Swal.fire({
          icon: 'success',
          title: 'Skill Endorsed successfully',
          confirmButtonText: 'Cool',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          } 
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Skill is already endorsed by you',
        })
      }
      }

    
}

$(() => {
$(window).load(() => {
  App.load()
})
})