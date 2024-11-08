from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import timedelta
from marshmallow import fields, ValidationError
from flask_cors import CORS
from password import mypassword


# Initialize Flask app and configure database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://root:{mypassword}@localhost/e_commerce_db'
db = SQLAlchemy(app)
ma = Marshmallow(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "methods": ["GET", "POST", "PUT", "DELETE"]}})

# Many-to-many relationship table between Orders and Products
order_product = db.Table(
    'Order_Product',
    db.Column('order_id', db.Integer, db.ForeignKey('Orders.id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('Products.id'), primary_key=True)
)

class Customer(db.Model):
    __tablename__ = 'Customers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(320))
    phone = db.Column(db.String(15))
    customer_account = db.relationship("Account", uselist=False, back_populates="customer")
    orders = db.relationship("Order", back_populates="customer")

class Order(db.Model):
    __tablename__ = 'Orders'
    id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.Date, nullable=False)
    expected_delivery_date = db.Column(db.Date, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('Customers.id'))
    customer = db.relationship("Customer", back_populates="orders")
    products = db.relationship("Product", secondary=order_product, back_populates="orders")

    def __init__(self, order_date, customer_id):
        self.order_date = order_date
        self.customer_id = customer_id
        self.expected_delivery_date = self.calculate_expected_delivery_date()

    def calculate_expected_delivery_date(self):
        return self.order_date + timedelta(days=3)

class Product(db.Model):
    __tablename__ = 'Products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    orders = db.relationship("Order", secondary=order_product, back_populates="products")

# Marshmallow schemas

class CustomersSchema(ma.Schema):
    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=True)
    class Meta:
        fields = ('name', 'email', 'phone', 'id')

customer_schema = CustomersSchema()
customers_schema = CustomersSchema(many=True)

class ProductsSchema(ma.Schema):
    name = fields.String(required=True)
    price = fields.Float(required=True)
    class Meta:
        fields = ('name', 'price', 'id')

product_schema = ProductsSchema()
products_schema = ProductsSchema(many=True)

class OrderViewSchema(ma.Schema):
    order_date = fields.Date(required=True)
    expected_delivery_date = fields.Date()
    customer_id = fields.Integer(required=True)
    product_ids = fields.Method("get_product_ids")

    class Meta:
        fields = ('order_date', 'expected_delivery_date', 'customer_id', 'product_ids', 'id')

    def get_product_ids(self, obj):
        return [product.id for product in obj.products]

order_view_schema = OrderViewSchema()
orders_view_schema = OrderViewSchema(many=True)

class OrderManipSchema(ma.Schema):
    order_date = fields.Date(required=True)
    expected_delivery_date = fields.Date(dump_only=True)
    customer_id = fields.Integer(required=True)
    product_ids = fields.List(fields.Integer, required=True)

    class Meta:
        fields = ('order_date', 'expected_delivery_date', 'customer_id', 'product_ids', 'id')

order_manip_schema = OrderManipSchema()
orders_manip_schema = OrderManipSchema(many=True)

# Routes
@app.route('/')
def home():
    return "Welcome to the home page"

@app.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return customers_schema.jsonify(customers)

@app.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"message": "Customer not found"}), 404
    return customer_schema.jsonify(customer)

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    customer.name = customer_data['name']
    customer.email = customer_data['email']
    customer.phone = customer_data['phone']
    
    db.session.commit()
    return customer_schema.jsonify(customer)

@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get(id)
    if customer:
        db.session.delete(customer)
        db.session.commit()
        return '', 204
    return jsonify({"message": "Customer not found"}), 404

@app.route('/add-customers', methods=['POST'])
def add_customers():
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_customer = Customer(name=customer_data['name'], email=customer_data['email'], phone=customer_data['phone'])
    db.session.add(new_customer)
    db.session.commit()
    return customer_schema.jsonify(new_customer), 201

@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return products_schema.jsonify(products)

@app.route('/add-products', methods=['POST'])
def add_product():
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    new_product = Product(name=product_data['name'], price=product_data['price'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "New product added successfully"})

@app.route('/products/<int:id>', methods=['GET'])
def product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    return product_schema.jsonify(product)

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if product:
        db.session.delete(product)
        db.session.commit()
        return '', 204
    return jsonify({"message": "Product not found"}), 404

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    try:
        product_data = product_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    product.name = product_data['name']
    product.price = product_data['price']

    db.session.commit()
    return product_schema.jsonify(product)

@app.route('/orders', methods=['POST'])
def place_order():
    try:
        order_data = order_manip_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    new_order = Order(order_date=order_data['order_date'], customer_id=order_data['customer_id'])
    db.session.add(new_order)
    db.session.commit()

    for product_id in order_data['product_ids']:
        product = Product.query.get(product_id)
        if product:
            new_order.products.append(product)
    
    db.session.commit()
    
    return jsonify({"message": "New order placed successfully"})

# Main block
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5000)
