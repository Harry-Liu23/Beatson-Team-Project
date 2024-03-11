from setuptools import setup, find_packages

setup(
    name='beatson_app',
    version='1.0.0',
    packages = find_packages(),
    py_modules=['infrastructure','application','test','process'],
    include_package_data=True,
)
