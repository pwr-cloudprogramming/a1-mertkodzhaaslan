from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os


template_dir = os.path.abspath('frontend/src')
app = Flask(__name__, template_folder=template_dir)

CORS(app)


game_state = {
    'board': [' '] * 9,
    'turn': 'X',
    'player_x': 'Player X',
    'player_o': 'Player O',
    'winner': None
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/set_names', methods=['POST'])
def set_names():
    data = request.json
    game_state['player_x'] = data['playerX']
    game_state['player_o'] = data['playerO']
    return jsonify({'status': 'Names set', 'playerX': game_state['player_x'], 'playerO': game_state['player_o']})

@app.route('/start', methods=['POST'])
def start_game():
    game_state['board'] = [' '] * 9
    game_state['turn'] = 'X'
    game_state['winner'] = None
    status = f"{game_state['player_x']} vs {game_state['player_o']} - Game started"
    return jsonify({'status': status, 'board': game_state['board'], 'turn': game_state['turn'], 'winner': game_state['winner']})

@app.route('/move', methods=['POST'])
def make_move():
    if game_state['winner']:
        return jsonify({'status': 'Game over', 'board': game_state['board'], 'winner': game_state['winner']})
    
    position = request.json['position']
    if game_state['board'][position] == ' ':
        game_state['board'][position] = game_state['turn']
        winner = check_win(game_state['board'])
        if winner:
            game_state['winner'] = game_state['turn']
            winner_name = game_state['player_x'] if winner == 'X' else game_state['player_o']
            status = f"{winner_name} wins!"
        else:
            game_state['turn'] = 'O' if game_state['turn'] == 'X' else 'X'
            next_player = game_state['player_x'] if game_state['turn'] == 'X' else game_state['player_o']
            status = f"{next_player}'s turn"
        return jsonify({'status': status, 'board': game_state['board'], 'turn': game_state['turn'], 'winner': game_state['winner']})
    else:
        return jsonify({'status': 'Invalid move'})

@app.route('/game_state', methods=['GET'])
def game_state_route():
    status = f"{game_state['player_x']}'s turn" if game_state['turn'] == 'X' else f"{game_state['player_o']}'s turn"
    if game_state['winner']:
        winner_name = game_state['player_x'] if game_state['winner'] == 'X' else game_state['player_o']
        status = f"{winner_name} wins!"
    return jsonify({
        'board': game_state['board'],
        'turn': game_state['turn'],
        'winner': game_state['winner'],
        'status': status,
    })

def check_win(board):
    winning_combinations = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),
        (0, 3, 6), (1, 4, 7), (2, 5, 8),
        (0, 4, 8), (2, 4, 6)
    ]
    for combo in winning_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] != ' ':
            return board[combo[0]]
    return None

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
