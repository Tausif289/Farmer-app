import { parseFileAndExtractSoilValues, generateSoilSuggestions } from "../utils/soilParser.js";

export const parseSoilReport = async (req, res) => {
  try {
    let soilValues;

    if (req.file) {
      // Case 1: User uploaded a file
      soilValues = await parseFileAndExtractSoilValues(req.file.path);
    } else if (req.body && Object.keys(req.body).length > 0) {
      // Case 2: User sent JSON values
      soilValues = req.body;
    } else {
      return res.status(400).json({
        success: false,
        message: "File or JSON values are required"
      });
    }

    const suggestions = generateSoilSuggestions(soilValues);

    res.json({
      success: true,
      data: { ...soilValues, suggestions }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Error parsing soil report"
    });
  }
};


export const saveSoilReport = async (req, res) => {
  try {
    const { values } = req.body;
    if (!values) return res.status(400).json({ success: false, message: "Values are required" });

    // TODO: save to DB
    res.json({ success: true, message: "Soil report saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Error saving report" });
  }
};