import { motion } from "framer-motion";

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
            <p style={{ textAlign: "center", fontSize: "1.5rem", margin: "20px 0" }}>Our achievements..</p>
            <div style={{
                width: "100%",
                padding: "40px 16px",
                display: "flex",
                justifyContent: "center"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: "960px",
                    width: "100%"
                }}>
                    {data.map((item, index) => (
                        <motion.div
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                margin: "0 16px",
                                backgroundColor: "white",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                padding: "20px",
                                borderRadius: "10px",
                                width: "160px",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "transform 0.3s, box-shadow 0.3s"
                            }}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.2,
                                duration: 0.6,
                                ease: "easeInOut",
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            <h2 style={{
                                color: "#4a5568",
                                fontSize: "1.125rem", /* 18px */
                                fontWeight: 600,
                                marginBottom: "8px"
                            }}>{item.label}</h2>
                            <p style={{
                                fontSize: "1.5rem", /* 24px */
                                color: "#d97706", /* Amber 800 */
                                fontWeight: "bold"
                            }}>{item.value}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default StatsRow;