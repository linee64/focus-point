from pywhispercpp.model import Model
import os

print("Loading pywhispercpp model...")
# Используем tiny модель
model = Model('tiny', models_dir=os.path.join(os.getcwd(), 'backend', 'temp', 'models_cpp'))
print("Model loaded successfully!")
