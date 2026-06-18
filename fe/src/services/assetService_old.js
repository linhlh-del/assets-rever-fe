import { apiClient } from "@/services/api";

// Get all assets with filters
export const getAssets = async ({
  search = "",
  category = null,
  status = null,
  department = null,
  assignedUser = null,
  page = 1,
  limit = 20,
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (status) params.append("status", status);
  if (department) params.append("department", department);
  if (assignedUser) params.append("assigned_user", assignedUser);

  const response = await apiClient.get(`/assets?${params}`);
  return response.data;
};

  if (status) {
    query = query.eq("status", status);
  }

// Get single asset
export const getAsset = async (assetCode) => {
  const response = await apiClient.get(`/assets/${assetCode}`);
  return response.data.asset;
};

// Create asset
export const createAsset = async (assetData) => {
  const response = await apiClient.post("/assets", assetData);
  return response.data.asset;
};

// Update asset
export const updateAsset = async (assetCode, assetData) => {
  const response = await apiClient.put(`/assets/${assetCode}`, assetData);
  return response.data.asset;
};

// Delete asset
export const deleteAsset = async (assetCode) => {
  await apiClient.delete(`/assets/${assetCode}`);
};

// Assign asset to user
export const assignAsset = async (assetCode, assignmentData) => {
  const response = await apiClient.post(`/assets/${assetCode}/assign`, assignmentData);
  return response.data.asset;
};

// Return asset from user
export const returnAsset = async (assetCode, returnData = {}) => {
  const response = await apiClient.post(`/assets/${assetCode}/return`, returnData);
  return response.data.asset;
};

// Upload asset images
export const uploadAssetImages = async (assetCode, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apiClient.post(`/assets/${assetCode}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.images;
};

// Get asset audit history
export const getAssetAuditTrail = async (assetCode) => {
  const response = await apiClient.get(`/assets/${assetCode}/history`);
  return response.data.history;
};
  const { data, error } = await supabase
    .from("assets")
    .insert([assetData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update asset
export const updateAsset = async (assetCode, assetData) => {
  const { data, error } = await supabase
    .from("assets")
    .update(assetData)
    .eq("asset_code", assetCode)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Assign asset to user
export const assignAsset = async (assetCode, assignmentData) => {
  // Create history record
  const { error: historyError } = await supabase.from("asset_history").insert([
    {
      asset_code: assetCode,
      user_employee_code: assignmentData.userEmployeeCode,
      from_date: new Date().toISOString(),
      department: assignmentData.department,
    },
  ]);

  if (historyError) throw historyError;

  // Update asset current assignment
  const { data, error } = await supabase
    .from("assets")
    .update({
      current_user_employee_code: assignmentData.userEmployeeCode,
      current_department: assignmentData.department,
      status: "in_use",
      assigned_date: new Date().toISOString(),
    })
    .eq("asset_code", assetCode)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Return asset (mark as available)
export const returnAsset = async (assetCode, returnData) => {
  // Update history - close current record
  const { error: historyError } = await supabase
    .from("asset_history")
    .update({ to_date: new Date().toISOString() })
    .eq("asset_code", assetCode)
    .is("to_date", null);

  if (historyError) throw historyError;

  // Update asset
  const { data, error } = await supabase
    .from("assets")
    .update({
      current_user_employee_code: null,
      current_department: returnData.department || null,
      status: "available",
    })
    .eq("asset_code", assetCode)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Report maintenance
export const reportMaintenance = async (assetCode, maintenanceData) => {
  const { data, error } = await supabase
    .from("maintenance_tickets")
    .insert([
      {
        asset_code: assetCode,
        reported_by_employee_code: maintenanceData.reportedBy,
        issue_description: maintenanceData.description,
        status: "open",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Update asset status
  await supabase
    .from("assets")
    .update({ status: "maintenance" })
    .eq("asset_code", assetCode);

  return data;
};

// Dispose asset
export const disposeAsset = async (assetCode, disposalData) => {
  const { data, error } = await supabase
    .from("assets")
    .update({
      status: "disposed",
      disposal_date: new Date().toISOString(),
      disposal_reason: disposalData.reason,
      current_user_employee_code: null,
    })
    .eq("asset_code", assetCode)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Upload asset images
export const uploadAssetImages = async (assetCode, files) => {
  const uploadedImages = [];

  for (const file of files) {
    const fileName = `${assetCode}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("asset-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("asset-images")
      .getPublicUrl(fileName);

    uploadedImages.push(data.publicUrl);
  }

  // Update the assets table with the new image URLs
  const { error: dbError } = await supabase
    .from("assets")
    .update({ image_urls: uploadedImages })
    .eq("asset_code", assetCode);

  if (dbError) throw dbError;

  return uploadedImages;
};

// Get asset audit history
export const getAssetAuditTrail = async (assetCode) => {
  const { data, error } = await supabase
    .from("asset_history")
    .select(
      `
      *,
      users(full_name, employee_code)
    `
    )
    .eq("asset_code", assetCode)
    .order("from_date", { ascending: false });

  if (error) throw error;
  return data || [];
};
