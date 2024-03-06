"""Module docstring.

This file set up a package structure for installing and packaging
"""
from setuptools import setup, find_packages

setup(
    name='beatson_app',
    version='1.0.0',
    packages = find_packages(),
    py_modules=['Infrastructure','application','test','process'],
    include_package_data=True,
)
