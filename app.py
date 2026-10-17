from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import h5py
import pickle
import numpy as np
import pandas as pd
import os
from typing import Optional, List, Dict, Any

app = FastAPI(
    title="Student Exam Score Prediction API",
    description="Machine Learning API powered by Scikit-Learn to predict student exam performance with feature engineering and diagnostic recommendations.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")
LINEAR_MODEL_PATH = os.path.join(BASE_DIR, "linear_model.h5")

model = None
model_source = "none"
model_coef = None
model_intercept = None

feature_order = [
    'Hours_Studied', 'Attendance', 'Parental_Involvement', 'Access_to_Resources',
    'Extracurricular_Activities', 'Sleep_Hours', 'Previous_Scores', 'Motivation_Level',
    'Internet_Access', 'Tutoring_Sessions', 'Family_Income', 'Teacher_Quality',
    'School_Type', 'Peer_Influence', 'Physical_Activity', 'Learning_Disabilities',
    'Parental_Education_Level', 'Distance_from_Home', 'Gender',
    'Study_Efficiency', 'Total_Prep', 'Support_Index'
]

if os.path.exists(MODEL_PATH):
    try:
        with h5py.File(MODEL_PATH, "r") as f:
            model_bytes = f["model"][()]
            model = pickle.loads(model_bytes.tobytes())
            model_source = "model.h5 (pickle)"
            model_coef = getattr(model, "coef_", None)
            model_intercept = getattr(model, "intercept_", None)
        print("Loaded model.h5 successfully!")
    except Exception as e:
        print(f"Warning: Failed to load pickled model from {MODEL_PATH}: {e}")

if model is None and os.path.exists(LINEAR_MODEL_PATH):
    try:
        with h5py.File(LINEAR_MODEL_PATH, "r") as f:
            model_coef = np.array(f["coef"])[()]
            model_intercept = float(np.array(f["intercept"])[()])
            model_source = "linear_model.h5 (weights)"
        print("Loaded linear_model.h5 weights successfully as fallback!")
    except Exception as e:
        print(f"Error loading {LINEAR_MODEL_PATH}: {e}")

if model is None and model_coef is None:
    raise RuntimeError("Could not load any ML model from model.h5 or linear_model.h5.")

MAPPINGS = {
    "Parental_Involvement": {"Low": 0, "Medium": 1, "High": 2},
    "Access_to_Resources": {"Low": 0, "Medium": 1, "High": 2},
    "Motivation_Level": {"Low": 0, "Medium": 1, "High": 2},
    "Family_Income": {"Low": 0, "Medium": 1, "High": 2},
    "Teacher_Quality": {"Low": 0, "Medium": 1, "High": 2},
    "Parental_Education_Level": {"High School": 0, "College": 1, "Postgraduate": 2},
    "Distance_from_Home": {"Near": 0, "Moderate": 1, "Far": 2},
    "Extracurricular_Activities": {"No": 0, "Yes": 1},
    "Internet_Access": {"No": 0, "Yes": 1},
    "School_Type": {"Public": 0, "Private": 1},
    "Peer_Influence": {"Negative": 0, "Neutral": 1, "Positive": 2},
    "Learning_Disabilities": {"No": 0, "Yes": 1},
    "Gender": {"Female": 0, "Male": 1}
}

class StudentInput(BaseModel):
    Hours_Studied: float = Field(..., ge=0, le=50, example=20)
    Attendance: float = Field(..., ge=0, le=100, example=85)
    Parental_Involvement: str = Field(..., example="Medium")
    Access_to_Resources: str = Field(..., example="High")
    Extracurricular_Activities: str = Field(..., example="No")
    Sleep_Hours: float = Field(..., ge=0, le=24, example=7)
    Previous_Scores: float = Field(..., ge=0, le=100, example=75)
    Motivation_Level: str = Field(..., example="High")
    Internet_Access: str = Field(..., example="Yes")
    Tutoring_Sessions: float = Field(..., ge=0, le=20, example=1)
    Family_Income: str = Field(..., example="Medium")
    Teacher_Quality: str = Field(..., example="Medium")
    School_Type: str = Field(..., example="Public")
    Peer_Influence: str = Field(..., example="Neutral")
    Physical_Activity: float = Field(..., ge=0, le=30, example=3)
    Learning_Disabilities: str = Field(..., example="No")
    Parental_Education_Level: str = Field(..., example="College")
    Distance_from_Home: str = Field(..., example="Near")
    Gender: str = Field(..., example="Male")

PRESETS = {
    "top_performer": {
        "title": "🌟 Honor Student",
        "description": "High attendance, dedicated study routine, strong resources & motivation",
        "data": {
            "Hours_Studied": 32,
            "Attendance": 96,
            "Parental_Involvement": "High",
            "Access_to_Resources": "High",
            "Extracurricular_Activities": "Yes",
            "Sleep_Hours": 8,
            "Previous_Scores": 88,
            "Motivation_Level": "High",
            "Internet_Access": "Yes",
            "Tutoring_Sessions": 2,
            "Family_Income": "High",
            "Teacher_Quality": "High",
            "School_Type": "Private",
            "Peer_Influence": "Positive",
            "Physical_Activity": 4,
            "Learning_Disabilities": "No",
            "Parental_Education_Level": "Postgraduate",
            "Distance_from_Home": "Near",
            "Gender": "Female"
        }
    },
    "balanced_routine": {
        "title": "⚖️ Balanced Routine",
        "description": "Standard study schedule, good attendance, moderate extracurriculars",
        "data": {
            "Hours_Studied": 20,
            "Attendance": 85,
            "Parental_Involvement": "Medium",
            "Access_to_Resources": "Medium",
            "Extracurricular_Activities": "No",
            "Sleep_Hours": 7,
            "Previous_Scores": 72,
            "Motivation_Level": "Medium",
            "Internet_Access": "Yes",
            "Tutoring_Sessions": 1,
            "Family_Income": "Medium",
            "Teacher_Quality": "Medium",
            "School_Type": "Public",
            "Peer_Influence": "Neutral",
            "Physical_Activity": 3,
            "Learning_Disabilities": "No",
            "Parental_Education_Level": "College",
            "Distance_from_Home": "Near",
            "Gender": "Male"
        }
    },
    "needs_support": {
        "title": "⚠️ Needs Academic Support",
        "description": "Lower attendance, low study hours, limited resources needing intervention",
        "data": {
            "Hours_Studied": 8,
            "Attendance": 60,
            "Parental_Involvement": "Low",
            "Access_to_Resources": "Low",
            "Extracurricular_Activities": "No",
            "Sleep_Hours": 6,
            "Previous_Scores": 55,
            "Motivation_Level": "Low",
            "Internet_Access": "No",
            "Tutoring_Sessions": 0,
            "Family_Income": "Low",
            "Teacher_Quality": "Low",
            "School_Type": "Public",
            "Peer_Influence": "Negative",
            "Physical_Activity": 1,
            "Learning_Disabilities": "No",
            "Parental_Education_Level": "High School",
            "Distance_from_Home": "Far",
            "Gender": "Male"
        }
    },
    "cramming_effort": {
        "title": "⚡ High Effort / Cramming",
        "description": "High study hours and tutoring, but low sleep and erratic attendance",
        "data": {
            "Hours_Studied": 30,
            "Attendance": 72,
            "Parental_Involvement": "Medium",
            "Access_to_Resources": "High",
            "Extracurricular_Activities": "No",
            "Sleep_Hours": 5,
            "Previous_Scores": 68,
            "Motivation_Level": "High",
            "Internet_Access": "Yes",
            "Tutoring_Sessions": 3,
            "Family_Income": "Medium",
            "Teacher_Quality": "Medium",
            "School_Type": "Public",
            "Peer_Influence": "Neutral",
            "Physical_Activity": 2,
            "Learning_Disabilities": "No",
            "Parental_Education_Level": "College",
            "Distance_from_Home": "Moderate",
            "Gender": "Female"
        }
    }
}

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Student Exam Score AI Predictor",
        "version": "1.1.0",
        "model_loaded": model is not None or model_coef is not None,
        "model_source": model_source
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_source": model_source,
        "features_count": len(feature_order)
    }

@app.get("/presets")
def get_presets():
    return PRESETS

@app.post("/predict")
def predict_score(data: StudentInput):
    try:
        payload = data.model_dump()
        numeric_dict = {}
        for key, value in payload.items():
            if key in MAPPINGS:
                val = MAPPINGS[key].get(str(value).strip(), 1)
                numeric_dict[key] = val
            else:
                numeric_dict[key] = float(value)

        study_eff = numeric_dict['Hours_Studied'] * (numeric_dict['Attendance'] / 100.0)
        total_prep = numeric_dict['Hours_Studied'] + (numeric_dict['Tutoring_Sessions'] * 1.5)
        support_idx = numeric_dict['Parental_Involvement'] + numeric_dict['Teacher_Quality'] + numeric_dict['Access_to_Resources']

        numeric_dict['Study_Efficiency'] = study_eff
        numeric_dict['Total_Prep'] = total_prep
        numeric_dict['Support_Index'] = support_idx

        df_input = pd.DataFrame([numeric_dict])[feature_order]

        if model is not None:
            predicted_score = float(model.predict(df_input)[0])
        else:
            features_vec = df_input.values[0]
            predicted_score = float(np.dot(features_vec, model_coef) + model_intercept)

        final_score = max(0.0, min(100.0, round(predicted_score, 2)))

        if final_score >= 85:
            grade = "A+"
            performance = "Outstanding"
            status_color = "emerald"
        elif final_score >= 75:
            grade = "A"
            performance = "Very Good"
            status_color = "blue"
        elif final_score >= 65:
            grade = "B"
            performance = "Good"
            status_color = "cyan"
        elif final_score >= 55:
            grade = "C"
            performance = "Average"
            status_color = "amber"
        else:
            grade = "D/F"
            performance = "Needs Improvement"
            status_color = "rose"

        z = (final_score - 67.2) / 4.0
        approx_percentile = round(100.0 / (1.0 + np.exp(-1.7 * z)), 1)
        approx_percentile = max(1.0, min(99.9, approx_percentile))

        recommendations = []
        if payload["Attendance"] < 90:
            potential_gain = round((92 - payload["Attendance"]) * 0.20, 1)
            if potential_gain > 0.5:
                recommendations.append({
                    "area": "Attendance Boost",
                    "impact": f"+{potential_gain} pts",
                    "tip": f"Increasing attendance to 92%+ provides the highest single boost to exam confidence and comprehension."
                })

        if payload["Hours_Studied"] < 25:
            recommendations.append({
                "area": "Weekly Study Time",
                "impact": "+2.0 to 4.5 pts",
                "tip": f"Adding 4-5 focused study hours weekly directly elevates your study efficiency index."
            })

        if payload["Tutoring_Sessions"] < 2 and final_score < 75:
            recommendations.append({
                "area": "Targeted Tutoring",
                "impact": "+1.5 to 3.0 pts",
                "tip": "Taking 1 or 2 guided tutoring sessions per month helps clarify difficult problem sets."
            })

        if payload["Sleep_Hours"] < 7:
            recommendations.append({
                "area": "Cognitive Recovery",
                "impact": "Crucial",
                "tip": f"Currently at {payload['Sleep_Hours']}h sleep. 7-8 hours per night sustains retention and prevents exam fatigue."
            })

        if payload["Internet_Access"] == "No":
            recommendations.append({
                "area": "Digital Resources",
                "impact": "+1.0 pt",
                "tip": "Leverage school library internet access for online interactive learning tools."
            })

        if not recommendations:
            recommendations.append({
                "area": "Excellence Sustained",
                "impact": "Optimal",
                "tip": "Outstanding study configuration! Maintain this routine through consistent practice exams."
            })

        strengths = []
        if payload["Attendance"] >= 85:
            strengths.append(f"Strong attendance record ({payload['Attendance']}%)")
        if payload["Hours_Studied"] >= 20:
            strengths.append(f"High dedicated study volume ({payload['Hours_Studied']} hrs/week)")
        if payload["Previous_Scores"] >= 75:
            strengths.append(f"Solid academic foundation (Previous Score: {payload['Previous_Scores']})")
        if support_idx >= 4:
            strengths.append("High support ecosystem (parents, teachers & resources)")
        if payload["Motivation_Level"] == "High":
            strengths.append("High intrinsic motivation & drive")

        if not strengths:
            strengths.append("Regular participation in coursework")

        return {
            "predicted_exam_score": final_score,
            "letter_grade": grade,
            "performance_category": performance,
            "percentile": approx_percentile,
            "status_color": status_color,
            "engineered_metrics": {
                "study_efficiency": round(study_eff, 2),
                "total_preparation_index": round(total_prep, 2),
                "support_network_score": round(support_idx, 2)
            },
            "key_strengths": strengths[:4],
            "recommendations": recommendations[:3]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
