import Placement from "../models/Placement.js";

// GET /api/placements — filtered + paginated list
export const getPlacements = async (req, res) => {
  try {
    const {
      year,
      branch,
      company,
      role,
      minPkg,
      maxPkg,
      type,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (year)          filter.year    = Number(year);
    if (branch)        filter.branch  = branch;
    if (company)       filter.company = { $regex: company, $options: "i" };
    if (role)          filter.role    = { $regex: role,    $options: "i" };
    if (type)          filter.type    = type;
    if (minPkg || maxPkg) {
      filter.package = {};
      if (minPkg) filter.package.$gte = Number(minPkg);
      if (maxPkg) filter.package.$lte = Number(maxPkg);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Placement.find(filter).sort({ package: -1 }).skip(skip).limit(Number(limit)),
      Placement.countDocuments(filter),
    ]);

    res.json({ data, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placements/stats
export const getStats = async (req, res) => {
  try {
    const [result] = await Placement.aggregate([
      {
        $group: {
          _id: null,
          totalPlacements: { $sum: 1 },
          highestPackage:  { $max: "$package" },
          avgPackage:      { $avg: "$package" },
          companies:       { $addToSet: "$company" },
        },
      },
    ]);
    res.json({
      totalPlacements: result?.totalPlacements ?? 0,
      highestPackage:  result ? Math.round(result.highestPackage * 10) / 10 : 0,
      avgPackage:      result ? Math.round(result.avgPackage     * 10) / 10 : 0,
      totalCompanies:  result?.companies?.length ?? 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placements/chart/yearly
export const getYearlyChart = async (req, res) => {
  try {
    const data = await Placement.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 }, avgPkg: { $avg: "$package" } } },
      { $sort:  { _id: 1 } },
      { $project: { year: "$_id", count: 1, avgPkg: { $round: ["$avgPkg", 1] }, _id: 0 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placements/chart/branch
export const getBranchChart = async (req, res) => {
  try {
    const data = await Placement.aggregate([
      { $group: { _id: "$branch", count: { $sum: 1 }, avgPkg: { $avg: "$package" } } },
      { $sort:  { count: -1 } },
      { $project: { branch: "$_id", count: 1, avgPkg: { $round: ["$avgPkg", 1] }, _id: 0 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placements/chart/companies
export const getCompaniesChart = async (req, res) => {
  try {
    const data = await Placement.aggregate([
      { $group: { _id: "$company", count: { $sum: 1 }, avgPkg: { $avg: "$package" } } },
      { $sort:  { count: -1 } },
      { $limit: 15 },
      { $project: { company: "$_id", count: 1, avgPkg: { $round: ["$avgPkg", 1] }, _id: 0 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placements/chart/package-dist
export const getPackageDist = async (req, res) => {
  try {
    const ranges = [
      { label: "0-5 LPA",   min: 0,  max: 5 },
      { label: "5-10 LPA",  min: 5,  max: 10 },
      { label: "10-15 LPA", min: 10, max: 15 },
      { label: "15-20 LPA", min: 15, max: 20 },
      { label: "20-25 LPA", min: 20, max: 25 },
      { label: "25-30 LPA", min: 25, max: 30 },
      { label: "30+ LPA",   min: 30, max: 10000 },
    ];
    const data = await Promise.all(
      ranges.map(async (r) => ({
        label: r.label,
        count: await Placement.countDocuments({ package: { $gte: r.min, $lt: r.max } }),
      })),
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placements/top-performers
export const getTopPerformers = async (req, res) => {
  try {
    const data = await Placement.find().sort({ package: -1 }).limit(10);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placements/filters
export const getFilters = async (req, res) => {
  try {
    const [years, branches, companies, roles] = await Promise.all([
      Placement.distinct("year"),
      Placement.distinct("branch"),
      Placement.distinct("company"),
      Placement.distinct("role"),
    ]);
    res.json({
      years:     years.sort((a, b) => b - a),
      branches:  branches.sort(),
      companies: companies.sort(),
      roles:     roles.sort(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
