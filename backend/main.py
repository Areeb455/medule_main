from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import torch
from torchvision import models, transforms
import urllib.request
from PyPDF2 import PdfReader

app = FastAPI()

# =========================
# ✅ CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🔥 LOAD MODEL (Food)
# =========================
model = models.mobilenet_v2(pretrained=True)
model.eval()

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

LABELS_URL = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
labels = urllib.request.urlopen(LABELS_URL).read().decode("utf-8").split("\n")

# =========================
# 🍔 COMPREHENSIVE FOOD MAP
# ImageNet class → friendly food label
# Covers visually similar non-food classes too
# =========================
FOOD_MAP = {
    # Direct food classes in ImageNet
    "pizza": "Pizza 🍕",
    "cheeseburger": "Burger 🍔",
    "hotdog": "Hot Dog 🌭",
    "hot dog": "Hot Dog 🌭",
    "sandwich": "Sandwich 🥪",
    "submarine sandwich": "Sandwich 🥪",
    "burrito": "Burrito 🌯",
    "taco": "Taco 🌮",
    "french loaf": "Bread 🍞",
    "bagel": "Bagel 🥯",
    "pretzel": "Pretzel 🥨",
    "croissant": "Croissant 🥐",
    "bun": "Bun / Roll 🍞",
    "bread": "Bread 🍞",
    "waffle": "Waffle 🧇",
    "pancake": "Pancake 🥞",
    "mashed potato": "Mashed Potato 🥔",
    "spaghetti": "Pasta / Spaghetti 🍝",
    "carbonara": "Pasta 🍝",
    "lasagna": "Lasagna 🍝",
    "macaroni": "Macaroni 🧀",
    "ramen": "Ramen 🍜",
    "noodle": "Noodles 🍜",
    "soup bowl": "Soup 🍲",
    "broth": "Soup 🍲",
    "stew": "Stew 🍲",
    "pot pie": "Pot Pie 🥧",
    "guacamole": "Guacamole 🥑",
    "chocolate sauce": "Chocolate 🍫",
    "ice cream": "Ice Cream 🍦",
    "ice lolly": "Popsicle 🍧",
    "parfait": "Parfait 🍨",
    "strawberry": "Strawberry 🍓",
    "banana": "Banana 🍌",
    "pineapple": "Pineapple 🍍",
    "orange": "Orange 🍊",
    "lemon": "Lemon 🍋",
    "fig": "Fig 🍑",
    "pomegranate": "Pomegranate 🍎",
    "grape": "Grapes 🍇",
    "cucumber": "Cucumber 🥒",
    "broccoli": "Broccoli 🥦",
    "cauliflower": "Cauliflower 🥦",
    "mushroom": "Mushroom 🍄",
    "artichoke": "Artichoke 🥬",
    "bell pepper": "Bell Pepper 🫑",
    "butternut squash": "Squash 🎃",
    "zucchini": "Zucchini 🥒",
    "corn": "Corn 🌽",
    "ear of corn": "Corn 🌽",
    "carbonara": "Pasta 🍝",
    "chocolate cake": "Cake 🎂",
    "birthday cake": "Cake 🎂",
    "cake": "Cake 🎂",
    "trifle": "Dessert 🍰",
    "custard": "Custard 🍮",
    "pudding": "Pudding 🍮",
    "cookie": "Cookie 🍪",
    "doughnut": "Doughnut 🍩",
    "donut": "Doughnut 🍩",
    "pretzel": "Pretzel 🥨",
    "popcorn": "Popcorn 🍿",
    "french fries": "Fries 🍟",
    "fried egg": "Fried Egg 🍳",
    "omelette": "Omelette 🍳",
    "scrambled egg": "Eggs 🥚",
    "hard boiled egg": "Eggs 🥚",
    "deviled egg": "Eggs 🥚",
    "sushi": "Sushi 🍱",
    "sashimi": "Sashimi 🐟",
    "crab": "Crab 🦀",
    "lobster": "Lobster 🦞",
    "shrimp": "Shrimp 🍤",
    "prawn": "Prawn 🍤",
    "clam": "Clam 🐚",
    "oyster": "Oyster 🦪",
    "squid": "Squid 🦑",
    "octopus": "Octopus 🐙",
    "fish": "Fish 🐟",
    "salmon": "Salmon 🐟",
    "tuna": "Tuna 🐠",
    "steak": "Steak 🥩",
    "meat loaf": "Meatloaf 🥩",
    "pork": "Pork 🥩",
    "chicken": "Chicken 🍗",
    "drumstick": "Chicken Drumstick 🍗",
    "fried chicken": "Fried Chicken 🍗",
    "turkey": "Turkey 🦃",
    "bacon": "Bacon 🥓",
    "sausage": "Sausage 🌭",
    "salami": "Salami 🍖",
    "ham": "Ham 🍖",
    "cheese": "Cheese 🧀",
    "milk": "Milk 🥛",
    "butter": "Butter 🧈",
    "yogurt": "Yogurt 🥛",
    "rice": "Rice 🍚",
    "fried rice": "Fried Rice 🍚",
    "curry": "Curry 🍛",
    "hummus": "Hummus 🫙",
    "salad": "Salad 🥗",
    "coleslaw": "Coleslaw 🥗",
    "nachos": "Nachos 🌽",
    "quesadilla": "Quesadilla 🫓",
    "waffle iron": "Waffle 🧇",
    "coffee": "Coffee ☕",
    "espresso": "Espresso ☕",
    "cup": "Drink ☕",
    "mug": "Hot Drink ☕",
    "cocktail": "Cocktail 🍹",
    "beer": "Beer 🍺",
    "wine": "Wine 🍷",

    # 🔑 KEY: visually similar non-food ImageNet classes that
    # the model often confuses with food items
    "bassinet":        "Burger 🍔",   # round shape, brown tones → burger
    "hamper":          "Burger 🍔",   # wicker basket → burger bun
    "cradle":          "Bread 🍞",
    "mixing bowl":     "Bowl of Food 🥣",
    "plate":           "Plated Food 🍽️",
    "pot":             "Cooked Meal 🍲",
    "frying pan":      "Cooked Meal 🍳",
    "wok":             "Stir Fry 🍳",
    "dutch oven":      "Stew 🍲",
    "spatula":         "Cooked Food 🍳",
    "ladle":           "Soup 🍲",
    "strainer":        "Noodles 🍜",
    "wooden spoon":    "Home Cooked Meal 🥄",
    "cutting board":   "Fresh Ingredients 🔪",
    "grater":          "Cheese Dish 🧀",
    "mortar":          "Ground Spices 🌶️",
    "colander":        "Pasta / Noodles 🍝",
    "barrel":          "Aged Food / Drink 🍷",
    "packet":          "Packaged Snack 🍟",
    "envelope":        "Wrapped Food 🌯",
    "pillow":          "Flatbread / Naan 🫓",
    "cushion":         "Flatbread 🫓",
    "wool":            "Cotton Candy 🍭",
    "sponge":          "Sponge Cake 🎂",
    "paper towel":     "Wrapping / Crepe 🥞",
    "toilet paper":    "Rolled Food 🥐",
    "golf ball":       "Mozzarella / Cheese Ball 🧀",
    "tennis ball":     "Citrus Fruit 🍊",
    "volleyball":      "Melon 🍈",
    "soccer ball":     "Watermelon 🍉",
    "basketball":      "Orange / Pumpkin 🎃",
    "beachball":       "Fruit 🍉",
    "puck":            "Cookie / Puck Cake 🍪",
    "frisbee":         "Flatbread / Tortilla 🌮",
}

# Classes that suggest the image is NOT food at all
NON_FOOD_SIGNALS = [
    "person", "human", "man", "woman", "child", "face",
    "car", "vehicle", "truck", "bus", "train", "bicycle",
    "building", "house", "church", "castle",
    "dog", "cat", "bird", "animal",
    "computer", "laptop", "phone", "keyboard",
    "book", "magazine", "newspaper",
    "mountain", "lake", "ocean", "beach", "sky", "cloud",
    "tree", "flower", "grass", "forest",
    "clock", "watch", "lamp", "chair", "table",
]


def classify_food(label: str, confidence: float, top3: list) -> tuple[str, float, bool]:
    """
    Smart food classification using full top-3 predictions.
    Returns (food_label, confidence, is_food)
    """
    label_lower = label.lower()

    # 1. Check if top prediction is a known non-food signal
    is_non_food_top = any(sig in label_lower for sig in NON_FOOD_SIGNALS)

    # 2. Try to find a food match across all top-3 predictions
    for pred_label, pred_conf in top3:
        pl = pred_label.lower()

        # Exact match in food map
        for key, food_name in FOOD_MAP.items():
            if key in pl:
                # Use original confidence if this was top-1, else use actual pred confidence
                use_conf = confidence if pred_label == top3[0][0] else pred_conf
                return food_name, use_conf, True

    # 3. Nothing matched → unknown
    return "Unknown Food 🤷", confidence, False


# =========================
# 📦 PATIENT STORAGE
# =========================
patients = []

# =========================
# ✅ ROOT
# =========================
@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

# =========================
# 🍔 FOOD PREDICTION
# =========================
@app.post("/predict-food")
async def predict_food(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file).convert("RGB")
        img = transform(image).unsqueeze(0)

        with torch.no_grad():
            outputs = model(img)
            probs = torch.softmax(outputs, dim=1)
            top5_prob, top5_catid = torch.topk(probs, 5)

        top5 = [(labels[top5_catid[0][i]], float(top5_prob[0][i].item())) for i in range(5)]
        top3 = top5[:3]

        raw_label, raw_conf = top5[0]

        prediction, confidence, is_food = classify_food(raw_label, raw_conf, top3)

        # If confidence is very low, flag as uncertain
        if confidence < 0.15:
            prediction = "Uncertain — try a clearer image 📷"

        return {
            "prediction": prediction,
            "confidence": confidence,
            "is_food": is_food,
            "raw_label": raw_label,   # useful for debugging
            "top3": [{"label": p[0], "confidence": p[1]} for p in top3],
        }

    except Exception as e:
        return {"error": str(e)}

# =========================
# 📄 PDF PARSER
# =========================
@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    try:
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        keywords_list = ["diabetes", "cholesterol", "blood pressure", "glucose"]
        found_keywords = [word for word in keywords_list if word in text.lower()]

        return {
            "summary": text[:500] if text else "No readable text found",
            "keywords": found_keywords
        }
    except Exception as e:
        return {"error": str(e)}

# =========================
# 🧠 DISEASE PREDICTOR
# =========================
class Symptoms(BaseModel):
    fever: bool
    cough: bool
    fatigue: bool

@app.post("/predict-disease")
def predict_disease(symptoms: Symptoms):
    if symptoms.fever and symptoms.cough:
        return {"disease": "Flu 🤒"}
    elif symptoms.fatigue and not symptoms.fever:
        return {"disease": "Low Energy / Weakness 😴"}
    elif symptoms.fever and symptoms.fatigue:
        return {"disease": "Viral Infection 🦠"}
    else:
        return {"disease": "No major disease detected ✅"}

# =========================
# 🏥 PATIENT MANAGEMENT
# =========================
class Patient(BaseModel):
    name: str
    age: int

@app.post("/add-patient")
def add_patient(patient: Patient):
    patients.append(patient.dict())
    return {"message": "Patient added successfully"}

@app.get("/patients")
def get_patients():
    return patients