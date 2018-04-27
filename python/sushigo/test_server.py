#import requests
#import io
#import json
#import re

import math
import threading
import random
import webapp2

"""
Generates a debug string representing the current gamestate.

The string contains all information about cards held and played by all players,
all players' points, and also information about the state of the server,
specifically which players the server is waiting for before continuing
to the next state. This string is not intended to be seen by users.
"""
# TODO: See if there's a better way to build strings since they are
# immutable in python.
def getDebugState():
  global players, isStarted, players_to_play, players_not_updated, lock
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points
  ret = 'DEBUG:'
  for player in players:
    ret += "Player {}\n".format(player)
    if player in player_hands:
      ret += "cards in hand {}\n".format(','.join(player_hands[player]))
    if player in player_played_cards:
      ret += "cards played {}\n".format(','.join(player_played_cards[player]))
    if player in player_points:
      ret += "points {}\n".format(player_points[player])
  if waiting_for_play:
    ret += "server is waiting for players to play.\n"
  if waiting_for_update:
    ret += "server is waiting for players to update.\n"
  for player in players_to_play:
    ret += "player {} needs to play\n".format(player)
  for player in players_not_updated:
    ret += "player {} needs to be updated\n".format(player)
  return ret

"""
Generates an encoded string representing the current gamestate.

The string contains only information known by the given player; ie, it
does not contain information about other players' hands. This string is
indended to be returned and understood by the client. More information
about the exact encoding of this response can be found in sushigo_repsonse.js.

Arguments:
player -- a string indicating the name of the player we generate the state for.
"""
def getPlayerState(player):
  # TODO: figure out how globals work and see if I can cut a bunch of this stuff out.
  global players, isStarted, players_to_play, players_not_updated, lock
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points
  ret = 'OK:'
  # Get the player's points.
  if player in player_points:
    ret += str(player_points[player])
  ret += ':'
  # Get the player's hand.
  if player in player_hands:
    ret += ','.join(player_hands[player])
  ret += ':'
  # Get the cards the player has played.
  if player in player_played_cards:
    ret += player
    if player_played_cards[player]:
      ret += ','
      ret += ','.join(player_played_cards[player])
  # Get the cards from all the other players.
  for p in players:
    if p != player and p in player_played_cards:
      ret += ':'
      ret += p
      if player_played_cards[p]:
        ret += ','
        ret += ','.join(player_played_cards[p])
  #print "!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  #print "getting state for {}".format(player)
  #print ret
  #print "???????????????????????????"
  return ret

"""
Plays a given card from the given player's hand.

First checks to see that the given play is valid (ie, the player
does actually have the card, the player is able to play a card 
at this time, etc). If it is, the player plays that card. If this
play triggers the end of a round or hand, updates the game state
accordingly.

If this move triggered a new gamestate, return a string representing
the new gamestate. If not (ie, because not all players have played
a card yet this hand), return a WAIT status.

Arguments:
player -- a string indicating the name of the player who plays the card. 
card -- a string indicating which card is being played.
extra_args -- a string which may contain extra arguments. for instance,
  if a player is using chopsticks, extra_args contains 'chopsticks'
"""
def playCard(player, card, extra_args):
  global players, isStarted, players_to_play, players_not_updated, lock
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points
  if not player in players_to_play:
    return "ERROR:Waiting for another player, you can't play yet."

  hand = player_hands[player]

  # Check to see if we are playing chopsticks.
  # TODO:this doesn't work when we're actually choosing the card, 'chopsticks'
  if extra_args == "chopsticks"
  #if card[:10] == "chopsticks":
    cards = card.split(',')
    if len(cards) != 2:
      return "ERROR:Tried to play chopsticks without playing exactly two cards."
    if not cards[0] in hand and cards[1] in had:
      return "ERROR:You don't have one or both of those cards."
    if not "chopsticks" in player_played_cards[player]:
      return "ERROR:Tried to play chopsticks without having chopsticks."
    player_played_cards[player].remove("chopsticks")
    hand.append("chopsticks")
    hand.remove(cards[0])
    hand.remove(cards[1])
    player_played_cards[player].append(cards[0])
    player_played_cards[player].append(cards[1])
  # Otherwise, we're just playing a single card.
  else:  
    if not card in hand:
      return "ERROR:You don't have that card."
    hand.remove(card)
    player_played_cards[player].append(card)
    players_to_play.remove(player)

  if not players_to_play and not player_hands[player]:
    endRound()
    players_not_updated.remove(player)
    return getPlayerState(player)
  elif not players_to_play:
    endHand()
    players_not_updated.remove(player)
    return getPlayerState(player)
  else:
    # TODO: some other state for OK?
    return "WAIT"
    #return getPlayerState(player)
    #return "played card, waiting now"

# hand is a [] of cards
# opp_hands is a [] of hands
def countPoints(hand, opp_hands):
  print "counting points"
  print "cards is: "
  print hand
  print "opp_cards is: "
  print opp_hands
  # Count the maki in each opponent's hand
  opp_maki = []
  for opp_hand in opp_hands:
    maki = 0
    maki_1 = opp_hand.count("maki_1")
    maki += maki_1
    maki_2 = opp_hand.count("maki_2")
    maki += (maki_2 * 2)
    maki_3 = opp_hand.count("maki_3")
    maki += (maki_3 * 3)
    opp_maki.append(maki)
  opp_maki.sort()

  # Count the easy points -- sashimi, tempura, dumplings
  points = 0
  sashimi = hand.count("sashimi")
  points += (10 * math.floor(sashimi/3))
  tempura = hand.count("tempura")
  points += (5 * math.floor(tempura/2))
  dumpling = hand.count("dumpling")
  for i in range(dumpling):
    points += (i+1)
  print "now, points is "
  print points

  # Count the maki the player has.
  maki = 0
  maki_1 = hand.count("maki_1")
  maki += maki_1
  maki_2 = hand.count("maki_2")
  maki += (maki_2 * 2)
  maki_3 = hand.count("maki_3")
  maki += (maki_3 * 3)

  print "opp_maki is: "
  print opp_maki
  # Handle all the various maki cases
  # If you have the most maki
  if maki > opp_maki[-1]:
    points += 6
  # If you tie for the most maki
  elif maki == opp_maki[-1]:
    num_most_maki = 2
    opp_maki = opp_maki[:-1]
    while len(opp_maki) > 0 and maki == opp_maki[-1]:
      num_most_maki += 1
      opp_maki = opp_maki[:-1]
    points += math.floor(6/num_most_maki)
  else:
    # Remove the last maki, because you're not in first place.
    opp_maki = opp_maki[:-1]
    if len(opp_maki) == 0:
      points += 3
    # If you have the second-most maki
    elif maki > opp_maki[-1]:
      points += 3
    # If you tie for the second-most maki
    elif maki == opp_maki[-1]:
      num_second_maki = 2
      opp_maki = opp_maki[:-1]
      while len(opp_maki) > 0 and maki == opp_maki[-1]:
        num_second_maki += 1
        opp_maki = opp_maki[:-1]
      points += math.floor(3/num_second_maki)

  print "now, points is "
  print points

  wasabi = 0
  # Count wasabi and nigiri
  for i in range(len(hand)):
    
    if hand[i] == "wasabi":
      wasabi += 1
    elif hand[i] == "nigiri_egg":
      if wasabi >= 1:
        wasabi -= 1
        points += 3
      else:
        points += 1
    elif hand[i] == "nigiri_salmon":
      if wasabi >= 1:
        wasabi -= 1
        points += 6
      else:
        points += 2
    elif hand[i] == "nigiri_squid":
      if wasabi >= 1:
        wasabi -= 1
        points += 9
      else:
        points += 3

  print "now, points is "
  print points
  # Count puddings
  # TODO: count puddings
  return points

def endRound():
  global players, isStarted, players_to_play, players_not_updated, lock, cur_round
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points
  for player in players:
    opp_hands = []
    # Generate a list of all opponents' hands
    for p in players:
      if p != player:
        opp_hands.append(player_played_cards[p])
    player_points[player] += countPoints(player_played_cards[player], opp_hands)
  cur_round += 1

  # Don't continue until all players have been updated.
  for player in players:
    players_not_updated.append(player)

  if cur_round < 4:
    for player in players:
      player_hands[player] = generateHand()

  waiting_for_play = False
  waiting_for_update = True

def endHand():
  global players, isStarted, players_to_play, players_not_updated, lock
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points


  #print "!!!!!!!!!!!!!!!!!!!!!"
  #print player_hands[players[0]]
  #print player_hands[players[1]]

  # Players swap hands
  # TODO: Make this generic for >2 players
  tmp_hand = player_hands[players[0]]
  player_hands[players[0]] = player_hands[players[1]]
  player_hands[players[1]] = tmp_hand

  #print player_hands[players[0]]
  #print player_hands[players[1]]

  # Await move from all players.
  #for player in players:
    #players_to_play.append(player)

  # Don't continue until all players have been updated.
  for player in players:
    players_not_updated.append(player)

  #print "swapping!"
  waiting_for_play = False
  waiting_for_update = True

# Generates a SHUFFLED deck
def generateDeck():
  global players, isStarted, players_to_play, players_not_updated, lock, cur_round, deck
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points
  for i in range (14):
    deck.append('tempura')
  for i in range(14):
    deck.append('sashimi')
  for i in range(14):
    deck.append('dumpling')
  for i in range(6):
    deck.append('maki_1')
  for i in range(12):
    deck.append('maki_2')
  for i in range(8):
    deck.append('maki_3')
  for i in range(5):
    deck.append('nigiri_egg')
  for i in range(10):
    deck.append('nigiri_salmon')
  for i in range(5):
    deck.append('nigiri_squid')
  for i in range(6):
    deck.append('wasabi')
  for i in range(10):
    deck.append('pudding')
  #for i in range(4):
  #  deck.append('chopsticks')
  random.shuffle(deck)

def generateHand():
  global deck
  hand = []
  # Smaller hands for testing
  #for i in range(5):
  for i in range(10):
    hand.append(deck.pop())
  return hand


def generateStartingGameState():
  global players, isStarted, players_to_play, players_not_updated, lock, cur_round, deck
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points

  waiting_for_play = True
  waiting_for_update = False
  cur_round = 1
  generateDeck()
  for player in players:
    player_hands[player] = generateHand()
    player_played_cards[player] = []
    players_to_play.append(player)
    player_points[player] = 0
  

def stripPunctuation(string):
  for char in ":,":
    string = string.replace(char, '')
  return string

def resetGame():
  global players, isStarted, players_to_play, players_not_updated, lock
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points
  players = []
  isStarted = False
  players_to_play = []
  players_not_updated = []
  waiting_for_play = True
  waiting_for_update = False
  player_hands = {}
  player_played_cards = {}
  player_points = {}
  cur_round = 0

def handleRequestAndGetResponse(request):
  global players, isStarted, players_to_play, players_not_updated, lock
  global waiting_for_play, waiting_for_update, player_hands, player_played_cards, player_points

  action = request.get("action")
  player = request.get("player")
  print "player is: {}".format(player)

  if action == 'debug':
    return getDebugState()

  # Add a player, if there are not already two players.
  elif action == 'addPlayer':
    player = request.get("player")
    if player and len(players) < 2:
      player = stripPunctuation(player)
      players.append(player)
      return getPlayerState(player)
    else:
      return "ERROR:Couldn't add player."

  # Clear all players, if the correct password is provided.
  elif action == 'resetGame':
    pwd = request.get("password")
    #TODO reenable this
    #if pwd == 'thepassword':
    resetGame()      
    return getPlayerState(player)

  # Start the game, generating hands for both players.
  elif action == 'startGame':
    if len(players) != 2:
      return "ERROR:Couldn't start the game because there weren't 2 people."
    # If the game is already started, the other player started the game, so return the player's hand.
    if not isStarted:
      isStarted = True
      generateStartingGameState()
    return getPlayerState(player)

  # The client is just trying to get an update after the other player's move.
  elif action == 'update':
    if waiting_for_play:
      return "WAIT:Not all players played yet."
    elif player not in players_not_updated:
      return "ERROR:This player isn't waiting to be updated."
    else:
      players_not_updated.remove(player)
      # If this was the last player not updated, move to the next step.
      if not players_not_updated:
        waiting_for_play = True
        waiting_for_update = False
        for p in players:
          players_to_play.append(p)
      return getPlayerState(player)
    #if player in players_to_play:
    #  return getPlayerState(player)
    #else:
    #  return "WAIT"

  # Play the given card.
  elif action == 'playCard':
    if waiting_for_update:
      return "WAIT:Not all players updated yet."
    else:
      card = request.get("card")
      extra_args = request.get("extra_args")
      return playCard(player, card, extra_args)

class MainPage(webapp2.RequestHandler):
  def get(self):
    global lock
    lock.acquire()
    response = handleRequestAndGetResponse(self.request)

    self.response.headers['Content-Type'] = 'text/plain'
    self.response.write(response)
    lock.release()

app = webapp2.WSGIApplication([
  (r'/.*', MainPage),
], debug=True)

lock = threading.Lock()
isStarted = False
players = []

# A list of players who have not yet played this hand.
players_to_play = []

# A list of players who have not been updated after a hand change.
players_not_updated = []

waiting_for_play = True
waiting_for_update = False

# mapping from string -> [string]
# ie, player to list of cards (in hand or play)
player_hands = {}
player_played_cards = {}
player_points = {}
cur_round = 0
#cards = ['sashimi', 'tempura', 'dumpling']
deck = []