import { useState } from "react";
import api from "../api/api";
const tips = [
    "Tailor your resume for every job application.",
    "Keep your resume to one page.",
    "Use action verbs like Developed, Built, Designed.",
    "Add measurable achievements whenever possible.",
    "Keep improving your GitHub projects."
];

export default function AICareerTips() {
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const getTips = async () => {

        try {

            setLoading(true);

            const response = await api.get("/ai/tips");

            setTips(response.data);

            setShowModal(true);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            style={{
                background:"#16213E",
                borderRadius:"18px",
                padding:"25px",
                height:"100%"
            }}
        >

            <h2 style={{color:"white"}}>
                💡 Today's AI Tip
            </h2>

            <p
                style={{
                    color:"#CBD5E1",
                    lineHeight:"28px",
                    marginTop:"20px"
                }}
            >
                Add measurable achievements in your resume.

                Example:

                <br/><br/>

                ❌ Developed backend APIs.

                <br/><br/>

                ✅ Developed 15 REST APIs reducing response
                time by 35%.
            </p>

             <button
                 onClick={getTips}
                 disabled={loading}
                 style={{
                     marginTop: "25px",
                     background: "#2563EB",
                     color: "white",
                     border: "none",
                     padding: "10px 18px",
                     borderRadius: "10px",
                     cursor: "pointer"
                 }}
             >
                 {loading ? "Generating..." : "More Tips →"}
             </button>

             {
             showModal && (

             <div
                 style={{
                     position:"fixed",
                     top:0,
                     left:0,
                     width:"100%",
                     height:"100%",
                     background:"rgba(0,0,0,.6)",
                     display:"flex",
                     justifyContent:"center",
                     alignItems:"center"
                 }}
             >

             <div
                 style={{
                     width:"500px",
                     background:"#16213E",
                     borderRadius:"20px",
                     padding:"30px",
                     color:"white"
                 }}
             >

             <h2>🤖 AI Career Tips</h2>

             <br/>

             {tips.map((tip,index)=>(

             <p
                 key={index}
                 style={{
                     marginBottom:"15px",
                     color:"#CBD5E1"
                 }}
             >
                 ✅ {tip}
             </p>

             ))}

             <div
                 style={{
                     display:"flex",
                     justifyContent:"flex-end",
                     marginTop:"25px"
                 }}
             >

             <button
                 onClick={()=>setShowModal(false)}
                 style={{
                     background:"#2563EB",
                     color:"white",
                     border:"none",
                     padding:"10px 20px",
                     borderRadius:"10px",
                     cursor:"pointer"
                 }}
             >
             Close
             </button>

             </div>

             </div>

             </div>

             )
             }



        </div>

    );

}