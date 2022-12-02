pragma solidity ^0.5.0;

contract VerifyMe {
    uint256 userCount = 0;
    uint256 skillCount = 0;

    struct Skill {
        uint256 skill_id;
        string name;
        uint256 level;
        uint256 endorsements;
    }

    struct User {
        uint256 user_id;
        string name;
        address waddress;
        string email;
        uint256[] user_skills;
    }

    mapping(address => User) public users;
    mapping(uint256 => Skill) public skills;

    function setEmail(string memory _email, string memory _name) public {
        require(msg.sender != users[msg.sender].waddress);
        User memory user = User({user_id: userCount, name: _name, waddress: msg.sender, email: _email, user_skills: new uint256[](0)});
        users[msg.sender] = user;
        userCount++;
    }

    function addSkill(string memory _name, uint256 _level) public {
        User storage user = users[msg.sender];
        Skill memory skill = Skill({skill_id: skillCount, name: _name, level: _level, endorsements: 0});
        user.user_skills.push(skillCount);
        skills[skillCount] = skill;
        skillCount++;
    }

    function endorseSkill(uint256 _id) public {
        Skill storage skill = skills[_id];
        skill.endorsements++;
        skills[_id] = skill;

    }

}