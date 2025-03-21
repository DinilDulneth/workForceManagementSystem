import { motion } from "framer-motion";
import "../styles/StatsRow.css"; // Importing the CSS file

const data = [
    { label: "Country", value: "50+" },
    { label: "Company", value: "157" },
    { label: "Employees", value: "2500+" },
    { label: "Revenue", value: "$1M" },
    { label: "Satisfied Clients", value: "98%" },
];

const StatsRow = () => {
    return (
        <>
        <p>Our achievements..</p>
        <div className="stats-row-container">
            
            <div className="stats-wrapper">
                
                {data.map((item, index) => (
                    <motion.div
                        key={index}
                        className="stats-item"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.2,
                            duration: 0.6,
                            ease: "easeInOut",
                        }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <h2 className="stats-label">{item.label}</h2>
                        <p className="stats-value">{item.value}</p>
                    </motion.div>
                ))}
            </div>
        </div>
        </>
    );
};

export default StatsRow;