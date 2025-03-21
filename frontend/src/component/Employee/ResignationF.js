import React, { useState } from "react";
import axios from "axios";

export default function ResignationF() {
  const [submitted, setsubmitted] = useState(false);
  const [empID, setempID] = useState("1");
  const [reason, setreason] = useState("");
  const [endDate, setendDate] = useState("");

  function setResignation(e) {
    e.preventDefault();
    const newResignation = {
      empId: empID,
      Reason: reason,
      endDate,
    };
    axios
      .post("http://localhost:8070/resignation/addempRes", newResignation)
      .then((res) => {
        alert("Resignation Added Successfully!✅");
        setsubmitted(true);
        setempID("");
        setreason("");
        setendDate("");
      })
      .catch((err) => {
        alert("Error adding Task: " + err.message);
      });
    console.log(newResignation);
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
        padding: "2.5rem",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {submitted ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "#2ecc71",
              color: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1.5rem",
            }}
          >
            ✓
          </div>
          <h3
            style={{
              color: "#474747",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Resignation Submitted
          </h3>
          <p
            style={{
              color: "#8f9491",
              fontSize: "1rem",
            }}
          >
            Your resignation has been successfully submitted.
          </p>
        </div>
      ) : (
        <>
          <h2
            style={{
              color: "#000000",
              textAlign: "center",
              marginBottom: "2rem",
              fontSize: "1.8rem",
              position: "relative",
              paddingBottom: "0.75rem",
            }}
          >
            Employee Resignation
            <span
              style={{
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "3px",
                backgroundColor: "#fc6625",
              }}
            ></span>
          </h2>
          <form
            onSubmit={setResignation}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                animation: "fadeIn 0.4s ease forwards",
                opacity: 0,
                animationDelay: "0.1s",
              }}
            >
              <label
                htmlFor="lastWorkingDate"
                style={{
                  color: "#474747",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  display: "block",
                }}
              >
                Last Working Date:
                <span
                  style={{
                    content: '"*"',
                    color: "#fc6625",
                    marginLeft: "4px",
                  }}
                ></span>
              </label>
              <input
                type="date"
                id="lastWorkingDate"
                name="lastWorkingDate"
                value={endDate}
                onChange={(e) => setendDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #8f9491",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  color: "#474747",
                  backgroundColor: "#ffffff",
                  transition: "all 0.3s ease",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                animation: "fadeIn 0.4s ease forwards",
                opacity: 0,
                animationDelay: "0.2s",
              }}
            >
              <label
                htmlFor="reason"
                style={{
                  color: "#474747",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  display: "block",
                }}
              >
                Reason for Resignation:
                <span
                  style={{
                    content: '"*"',
                    color: "#fc6625",
                    marginLeft: "4px",
                  }}
                ></span>
              </label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Please provide your reason for resignation"
                value={reason}
                onChange={(e) => setreason(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #8f9491",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  color: "#474747",
                  backgroundColor: "#ffffff",
                  transition: "all 0.3s ease",
                  minHeight: "120px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              ></textarea>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  flex: 1,
                  backgroundColor: "#fc6625",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e55a1c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fc6625")
                }
              >
                Submit Resignation
              </button>
              <button
                type="button"
                onClick={() => setsubmitted(false)}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  flex: 1,
                  backgroundColor: "#ffffff",
                  color: "#474747",
                  border: "1px solid #8f9491",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

const fadeIn = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${fadeIn}</style>`);