# Analysis Classes for Join Commmunity

### Entity Class: citizen
- username
- password
- status

### Boundary Class: CitizenJoinCommunity
- validate()
- SendRegisterRequest()
- displayWelcomePage()
- displayHomePage()
- displayErrorMsg()

### ControlClass: JoinCommunityController
- router()
- validate()
- CheckIfExist()
- toConfirm()
- setOnline()
- setOffline()
- addUser()
- checkPWD()

### Boundary Class:DirectoryJoinCommunity
- displayDirectory()
- SortDirectory()

### Entity Class: directory
- citizens

