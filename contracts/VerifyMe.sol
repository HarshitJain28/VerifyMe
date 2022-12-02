pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract VerifyMe {
    uint256 public userCount = 0;
    uint256 public skillCount = 0;

    struct Skill {
        uint256 skill_id;
        string name;
        uint256 level;
        uint256 endorsements;
        address user;
        address[] endorsed_by;
    }

    struct User {
        uint256 user_id;
        string name;
        address waddress;
        string email;
    }

    mapping(address => User) public users;
    mapping(uint256 => Skill) public skills;

    function setEmail(string memory _email, string memory _name) public {
        require(msg.sender != users[msg.sender].waddress);
        User memory user = User({user_id: userCount, name: _name, waddress: msg.sender, email: _email});
        users[msg.sender] = user;
        userCount++;
    }

    function addSkill(string memory _name, uint256 _level) public {
        User storage user = users[msg.sender];
        Skill memory skill = Skill({skill_id: skillCount, name: _name, level: _level, endorsements: 0, user: msg.sender, endorsed_by: new address[](0)});
        skills[skillCount] = skill;
        skillCount++;
    }

    function endorsement_exists(address[] memory endorsed_by) private returns (bool) {
    for (uint i = 0; i < endorsed_by.length; i++) {
        if (endorsed_by[i] == msg.sender) {
            return true;
        }
    }
        return false;
    }

    function endorseSkill(uint256 _id) public {
        Skill storage skill = skills[_id];
        require(!endorsement_exists(skill.endorsed_by),"Endorsement already exists");
        skill.endorsements++;
        skill.endorsed_by.push(msg.sender);
        skills[_id] = skill;

    }
}