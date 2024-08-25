# bacoom

⚠️ Leader commands :

- /raid - Create marathon.
  (raid name) - e.g. arma / alzanor
  (leader) - e.g. @Erdbeere
  (day) - e.g. 2 / 13 / 27
  (month) - e.g. 2 / 4 / 12 - automatically swap (February / April / December)
  (hour) - e.g. 10:30 / 19:00 / 21:45
  (number of hours marathon) - e.g. 1 - automatically add 'h' (number of hours)
  (priority of family) - e.g. 24 - automatically add 'h' (number of hours)
  (meeting place) - e.g. Cylloan 14:50 Ch6
  (contribution) - e.g. 1 seal from person
  (requirements lvl/eq/dmg) - e.g. 60aw 1+0, 80aw 1+1
  (extra info) - e.g. Don't be late!

- /editraid - Edits marathon (enter command on specific marathon channel you want to edit).

- /removeplayer - Removes user from marathon (enter command on specific marathon channel from which you want to eject the player).

- /leaderslist - Shows list of users with LEADER role.

- /offenses - Shows the history offenses of user.
  (user) - Player to check e.g. @Erdbeere

- /warn - Give warning to user with clear reason.
  (user) - player to warn e.g. @Erdbeere
  (reason) - clear reason for giving a warning e.g. Lack of attendance at Alzanor marathon

  Each warn is automatically set for 30 days and stored in the database.
  After 3 warnings, user is automatically blocked for 14 days.

- /unwarn - Remove warning from user.
  (user) - player to unwarn e.g. @Erdbeere
  (warning number) - e.g. 1 / 2 / 3 - depending on number of the warn

- /ban - Give block to user with clear reason.
  (user) - player to who you want to give the block e.g. @Erdbeere
  (reason) - clear reason for giving a block e.g. Reprehensible behavior at the Pollutus marathon
  (block time) - specific number of days to give the block e.g. 7 / 14 - automatically save as number of days

- /unban - Remove block from user.
  (user) - player to who you want to remove a block e.g. @Erdbeere
  (remove last warning) - set to true/false
  (remove all warnings) - set to true/false

- /giverole or /removerole - Give or remove role of marathons requirements.
  (role) - e.g. @a9
  (user) - player to who you want to give/remove role e.g. @Erdbeere

## By Adrian Łepek and Wiktor Kulczyk
