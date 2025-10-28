import Service from '../models/serviceModel.js';

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  const { type, description, price, isAvailable } = req.body;

  const service = new Service({
    type,
    description,
    price,
    isAvailable,
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
};

// @desc    Get all services
// @route   GET /api/services
// @access  Private
const getServices = async (req, res) => {
  const services = await Service.find({});
  res.json(services);
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  const { type, description, price, isAvailable } = req.body;
  const service = await Service.findById(req.params.id);

  if (service) {
    service.type = type || service.type;
    service.description = description || service.description;
    service.price = price || service.price;
    service.isAvailable = isAvailable === undefined ? service.isAvailable : isAvailable;

    const updatedService = await service.save();
    res.json(updatedService);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
};

export { createService, getServices, updateService, deleteService };