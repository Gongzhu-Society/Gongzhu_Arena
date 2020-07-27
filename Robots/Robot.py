import time,random

class Robot:
    def __init__(self,room,place,name,create_room = False):
        self.place = place
        self.room = room
        self.name = name
        self.players_information = [None, None, None, None]
        self.cards_list = []
        self.initial_cards = []
        self.history = []
        self.cards_on_table = []
        self.game_mode = 4
        self.scores = [[],[],[],[]]
        self.scores_num = [0,0,0,0]
        self.state = 'logout'
        self.creator = create_room
        self.master = 'MrComputer'

        self.res = []

    def pick_a_card(self):
        self.mycards = {"S": [], "H": [], "D": [], "C": [], "J": []}
        for i in self.cards_list:
            self.mycards[i[0]].append(i[1:])

        suit = 'A' if len(self.cards_on_table) == 1 else self.cards_on_table[1][0]

        while True:
            if suit == 'H':
                if suit not in self.mycards:
                    if 'J' not in self.mycards:
                        suit = random.choice(list(self.mycards.keys()))
                    else:
                        suit = 'J'
            elif suit == 'J':
                if suit not in self.mycards:
                    if 'H' not in self.mycards:
                        suit = random.choice(list(self.mycards.keys()))
                    else:
                        suit = 'H'

            else:
                if suit not in self.mycards:
                    suit = random.choice(list(self.mycards.keys()))

            if len(self.mycards[suit]) == 0:
                self.mycards.pop(suit)
                continue
            else:
                break

        i = random.randint(0, len(self.mycards[suit]) - 1)

        print("{} plays {}".format(self.name,suit + self.mycards[suit][i]))

        return suit + self.mycards[suit][i]

    def __str__(self):
        return 'name:{} state:{}'.format(self.name,self.state)

    def shuffle(self):
        pass

    def update(self):
        pass

    def trickend(self):
        pass

    def gameend(self):
        if self.place == 0:
            print('result:{}'.format(self.scores_num,self.scores_num[self.place]))
            nm = ''
            for pl in self.players_information:
                nm += pl[0]
                nm += '_'

            nm += '.txt'

            with open(nm, 'a') as f:
                s = ''
                for turn in self.history:
                    s += str(turn[0])
                    s += ','
                    for t in range(4):
                        s += turn[t + 1]
                        s += ','
                    s += '\n'
                s += '\n'
                s += 'result:'

                for n in self.scores_num:
                    s += str(n)
                    s += ','
                s += '\n\n\n'

                f.write(s)
        #time.sleep(1)
        self.res.append(self.scores_num[self.place])





    @staticmethod
    def family_name():
        return 'Coucou'
